<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Authenticate a user by email and password and issue a Sanctum API token.
     *
     * Uses `Auth::validate()` rather than `Auth::attempt()`/`Auth::once()`: it
     * checks credentials inside Laravel's Timebox, so both failure branches
     * take constant time, and it never sets a user on the session guard. That
     * matters because `sanctum.guard` is `['web']`, so a user left on the
     * session guard would make Sanctum resolve a TransientToken in place of
     * the real bearer token.
     *
     * @throws ValidationException
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        if (! Auth::validate($request->safe()->only(['email', 'password']))) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        /** @var User $user */
        $user = Auth::getLastAttempted();

        return response()->json([
            'user' => UserResource::make($user),
            'token' => $user->issueApiToken()->plainTextToken,
        ]);
    }
}
