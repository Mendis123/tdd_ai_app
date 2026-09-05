<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

use function Pest\Laravel\assertDatabaseMissing;

describe('register', function () {
    it('creates a user and returns a token', function () {
        $response = $this->postJson('/api/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => 'secret123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.name', 'Ada Lovelace')
            ->assertJsonPath('user.email', 'ada@example.com')
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'created_at'], 'token']);

        $user = User::query()->where('email', 'ada@example.com')->firstOrFail();
        expect(Hash::check('secret123', $user->password))->toBeTrue();
    });

    it('rejects an empty payload', function () {
        $response = $this->postJson('/api/register', []);

        $response->assertUnprocessable()->assertJsonValidationErrors(['name', 'email', 'password']);
    });

    it('rejects a duplicate email', function () {
        User::factory()->create(['email' => 'ada@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => 'secret123',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['email']);
    });

    it('rejects a password shorter than 8 characters', function () {
        $response = $this->postJson('/api/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => 'short',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['password']);
    });
});

describe('login', function () {
    it('authenticates with valid credentials and returns a token', function () {
        $user = User::factory()->create(['password' => Hash::make('secret123')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
    });

    it('rejects an incorrect password', function () {
        $user = User::factory()->create(['password' => Hash::make('secret123')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['email']);
    });

    it('rejects an unknown email', function () {
        $response = $this->postJson('/api/login', [
            'email' => 'missing@example.com',
            'password' => 'secret123',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['email']);
    });
});

describe('logout', function () {
    it('revokes the current token', function () {
        $user = User::factory()->create(['password' => Hash::make('secret123')]);

        $token = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ])->json('token');

        $response = $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/logout');

        $response->assertNoContent();

        $tokenId = explode('|', $token, 2)[0];
        assertDatabaseMissing('personal_access_tokens', ['id' => $tokenId]);
    });

    it('returns 401 without a token', function () {
        $response = $this->postJson('/api/logout');

        $response->assertUnauthorized();
    });
});

describe('me', function () {
    it('returns the authenticated user', function () {
        $user = User::factory()->create(['password' => Hash::make('secret123')]);

        $token = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ])->json('token');

        $response = $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/user');

        $response->assertOk()->assertJsonPath('data.id', $user->id);
    });

    it('returns 401 without a token', function () {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized();
    });
});
