<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->optional()->paragraph(),
            'status' => TaskStatus::Pending,
            'priority' => TaskPriority::Medium,
            'due_date' => fake()->optional()->dateTimeBetween('now', '+1 month'),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => TaskStatus::Pending]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => ['status' => TaskStatus::InProgress]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => ['status' => TaskStatus::Completed]);
    }

    public function low(): static
    {
        return $this->state(fn (array $attributes) => ['priority' => TaskPriority::Low]);
    }

    public function medium(): static
    {
        return $this->state(fn (array $attributes) => ['priority' => TaskPriority::Medium]);
    }

    public function high(): static
    {
        return $this->state(fn (array $attributes) => ['priority' => TaskPriority::High]);
    }
}
