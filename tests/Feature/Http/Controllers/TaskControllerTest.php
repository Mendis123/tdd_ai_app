<?php

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertModelMissing;

describe('index', function () {
    it('returns a paginated list of tasks for the authenticated user', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $task = Task::factory()->for($user)->create();

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $task->id)
            ->assertJsonPath('data.0.title', $task->title)
            ->assertJsonStructure([
                'data' => [
                    ['id', 'title', 'description', 'status', 'priority', 'due_date', 'created_at', 'updated_at'],
                ],
                'links',
                'meta',
            ]);
    });

    it('returns an empty list when no tasks exist', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson('/api/tasks');

        $response->assertOk()->assertJsonPath('data', []);
    });

    it('does not include tasks belonging to another user', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Task::factory()->for($otherUser)->create();
        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson('/api/tasks');

        $response->assertOk()->assertJsonPath('data', []);
    });

    it('returns 401 without authentication', function () {
        $response = $this->getJson('/api/tasks');

        $response->assertUnauthorized();
    });
});

describe('store', function () {
    it('creates a task with a valid payload', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $payload = [
            'title' => 'Write project plan',
            'description' => 'Draft the Q1 roadmap',
            'status' => TaskStatus::InProgress->value,
            'priority' => TaskPriority::High->value,
            'due_date' => '2026-12-01',
        ];

        $response = $this->postJson('/api/tasks', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Write project plan')
            ->assertJsonPath('data.status', 'in_progress')
            ->assertJsonPath('data.priority', 'high')
            ->assertJsonPath('data.due_date', '2026-12-01');

        assertDatabaseHas('tasks', [
            'title' => 'Write project plan',
            'status' => 'in_progress',
            'priority' => 'high',
            'user_id' => $user->id,
        ]);
    });

    it('assigns the task to the authenticated user regardless of a client-supplied user_id', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Buy groceries',
            'user_id' => $otherUser->id,
        ]);

        $response->assertCreated();

        assertDatabaseHas('tasks', [
            'title' => 'Buy groceries',
            'user_id' => $user->id,
        ]);
    });

    it('defaults status to pending and priority to medium when omitted', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->postJson('/api/tasks', ['title' => 'Buy groceries']);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.priority', 'medium');
    });

    it('rejects an empty payload', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->postJson('/api/tasks', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    });

    it('rejects a title over 255 characters', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->postJson('/api/tasks', ['title' => str_repeat('a', 256)]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    });

    it('rejects an invalid value for a field', function (string $field, string $value) {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Valid title',
            $field => $value,
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors([$field]);
    })->with([
        'invalid status' => ['status', 'archived'],
        'invalid priority' => ['priority', 'urgent'],
        'invalid due_date' => ['due_date', 'not-a-date'],
    ]);

    it('does not persist a task when validation fails', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $this->postJson('/api/tasks', []);

        expect(Task::count())->toBe(0);
    });

    it('returns 401 without authentication', function () {
        $response = $this->postJson('/api/tasks', ['title' => 'Buy groceries']);

        $response->assertUnauthorized();
    });
});

describe('show', function () {
    it('returns a single task', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $task = Task::factory()->for($user)->create();

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertOk()->assertJsonPath('data.id', $task->id);
    });

    it('returns 404 for a non-existent task', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->getJson('/api/tasks/'.Str::uuid());

        $response->assertNotFound();
    });

    it('returns 404 for a non-uuid identifier', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->getJson('/api/tasks/not-a-uuid');

        $response->assertNotFound();
    });

    it("returns 404 for another user's task", function () {
        $otherUser = User::factory()->create();
        $task = Task::factory()->for($otherUser)->create();
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertNotFound();
    });

    it('returns 401 without authentication', function () {
        $task = Task::factory()->for(User::factory())->create();

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertUnauthorized();
    });
});

describe('update', function () {
    it('updates the given fields', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $task = Task::factory()->for($user)->pending()->create();

        $response = $this->patchJson("/api/tasks/{$task->id}", [
            'status' => TaskStatus::Completed->value,
        ]);

        $response->assertOk()->assertJsonPath('data.status', 'completed');

        assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    });

    it('rejects an empty title', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $task = Task::factory()->for($user)->create();

        $response = $this->patchJson("/api/tasks/{$task->id}", ['title' => '']);

        $response->assertUnprocessable()->assertJsonValidationErrors(['title']);
    });

    it('returns 404 for a non-existent task', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->patchJson('/api/tasks/'.Str::uuid(), ['title' => 'Updated']);

        $response->assertNotFound();
    });

    it("returns 404 for another user's task", function () {
        $otherUser = User::factory()->create();
        $task = Task::factory()->for($otherUser)->create();
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->patchJson("/api/tasks/{$task->id}", ['title' => 'Updated']);

        $response->assertNotFound();
    });

    it('returns 401 without authentication', function () {
        $task = Task::factory()->for(User::factory())->create();

        $response = $this->patchJson("/api/tasks/{$task->id}", ['title' => 'Updated']);

        $response->assertUnauthorized();
    });
});

describe('destroy', function () {
    it('deletes the task', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $task = Task::factory()->for($user)->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        assertModelMissing($task);
    });

    it('returns 404 for a non-existent task', function () {
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->deleteJson('/api/tasks/'.Str::uuid());

        $response->assertNotFound();
    });

    it("returns 404 for another user's task", function () {
        $otherUser = User::factory()->create();
        $task = Task::factory()->for($otherUser)->create();
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNotFound();
    });

    it('returns 401 without authentication', function () {
        $task = Task::factory()->for(User::factory())->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertUnauthorized();
    });
});
