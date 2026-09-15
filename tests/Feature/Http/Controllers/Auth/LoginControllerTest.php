<?php

use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Sleep;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;

it('authenticates with valid credentials and returns a token', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ]);

    $response->assertOk()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.email', $user->email)
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email', 'created_at'],
            'token',
        ]);

    assertDatabaseHas('personal_access_tokens', [
        'tokenable_id' => $user->id,
        'tokenable_type' => User::class,
        'name' => 'api',
    ]);
});

it('returns a token that authenticates subsequent requests', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $token = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ])->json('token');

    $this->withToken($token)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('data.id', $user->id);
});

it('rejects an empty payload', function () {
    $this->postJson('/api/login', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});

it('rejects an incorrect password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'These credentials do not match our records.']);
});

it('rejects an unknown email', function () {
    $this->postJson('/api/login', [
        'email' => 'missing@example.com',
        'password' => 'secret123',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'These credentials do not match our records.']);
});

it('does not log the user in statefully', function () {
    Event::fake([Login::class]);
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ])
        ->assertOk()
        ->assertCookieMissing(config('session.cookie'));

    Event::assertNotDispatched(Login::class);
});

it('leaves the session guard unauthenticated so sanctum still resolves bearer tokens', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ])->assertOk();

    expect(Auth::guard('web')->hasUser())->toBeFalse();
});

it('returns an identical error for an unknown email and an incorrect password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $unknownEmail = $this->postJson('/api/login', [
        'email' => 'missing@example.com',
        'password' => 'secret123',
    ]);

    $wrongPassword = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    expect($unknownEmail->json())->toBe($wrongPassword->json());
});

it('does not issue a token when authentication fails', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertUnprocessable();

    assertDatabaseCount('personal_access_tokens', 0);
});

it('returns exactly the documented sign-in response shape', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ])->assertOk();

    expect(array_keys($response->json()))->toEqualCanonicalizing(['user', 'token'])
        ->and(array_keys($response->json('user')))->toEqualCanonicalizing(['id', 'name', 'email', 'created_at'])
        ->and($response->json('token'))->toBeString()->toContain('|');
});

describe('constant-time failures', function () {
    it('pads the response when authentication fails', function () {
        Sleep::fake();

        $this->postJson('/api/login', [
            'email' => 'missing@example.com',
            'password' => 'secret123',
        ])->assertUnprocessable();

        Sleep::assertSlept(fn () => true);
    });

    it('does not pad a successful sign-in', function () {
        Sleep::fake();
        $user = User::factory()->create(['password' => Hash::make('secret123')]);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ])->assertOk();

        Sleep::assertNeverSlept();
    });
});
