<?php

use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

it('creates a user with a uuid primary key', function () {
    $user = User::factory()->create();

    expect(Str::isUuid($user->id))->toBeTrue();
});

it('generates a different uuid for each user', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    expect($userA->id)->not->toBe($userB->id);
});

it('stores the id column as a uuid-typed column', function () {
    expect(Schema::getColumnType('users', 'id'))->toBe('char');
});

it('authenticates via sanctum with a uuid user', function () {
    $user = User::factory()->create();

    $token = $user->createToken('test-token')->plainTextToken;

    $tokenId = explode('|', $token, 2)[0];
    $accessToken = $user->tokens()->findOrFail($tokenId);

    expect($accessToken->tokenable_id)->toBe($user->id)
        ->and(Str::isUuid($accessToken->tokenable_id))->toBeTrue();
});
