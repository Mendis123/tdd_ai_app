<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    /**
     * Register a new user and return an access token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return response()->json([
            'user' => UserResource::make($user),
            'token' => $user->issueApiToken()->plainTextToken,
        ], Response::HTTP_CREATED);
    }

    /**
     * Revoke the current access token.
     */
    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }
}
