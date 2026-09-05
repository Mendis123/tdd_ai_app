<?php

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Task;
use Illuminate\Support\Str;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertModelMissing;

describe('index', function () {
    it('returns a paginated list of tasks', function () {
        $task = Task::factory()->create();

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
        $response = $this->getJson('/api/tasks');

        $response->assertOk()->assertJsonPath('data', []);
    });
});

describe('store', function () {
    it('creates a task with a valid payload', function () {
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
        ]);
    });

    it('defaults status to pending and priority to medium when omitted', function () {
        $response = $this->postJson('/api/tasks', ['title' => 'Buy groceries']);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.priority', 'medium');
    });

    it('rejects an empty payload', function () {
        $response = $this->postJson('/api/tasks', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    });

    it('rejects a title over 255 characters', function () {
        $response = $this->postJson('/api/tasks', ['title' => str_repeat('a', 256)]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    });

    it('rejects an invalid value for a field', function (string $field, string $value) {
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
        $this->postJson('/api/tasks', []);

        expect(Task::count())->toBe(0);
    });
});

describe('show', function () {
    it('returns a single task', function () {
        $task = Task::factory()->create();

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertOk()->assertJsonPath('data.id', $task->id);
    });

    it('returns 404 for a non-existent task', function () {
        $response = $this->getJson('/api/tasks/'.Str::uuid());

        $response->assertNotFound();
    });

    it('returns 404 for a non-uuid identifier', function () {
        $response = $this->getJson('/api/tasks/not-a-uuid');

        $response->assertNotFound();
    });
});

describe('update', function () {
    it('updates the given fields', function () {
        $task = Task::factory()->pending()->create();

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
        $task = Task::factory()->create();

        $response = $this->patchJson("/api/tasks/{$task->id}", ['title' => '']);

        $response->assertUnprocessable()->assertJsonValidationErrors(['title']);
    });

    it('returns 404 for a non-existent task', function () {
        $response = $this->patchJson('/api/tasks/'.Str::uuid(), ['title' => 'Updated']);

        $response->assertNotFound();
    });
});

describe('destroy', function () {
    it('deletes the task', function () {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        assertModelMissing($task);
    });

    it('returns 404 for a non-existent task', function () {
        $response = $this->deleteJson('/api/tasks/'.Str::uuid());

        $response->assertNotFound();
    });
});
