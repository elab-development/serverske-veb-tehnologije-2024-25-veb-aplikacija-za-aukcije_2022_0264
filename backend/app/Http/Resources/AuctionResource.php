<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuctionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->product?->name,
            'description' => $this->description,
            'start_price' => $this->start_price,
            'current_price' => $this->highest_bid ?? $this->start_price,
            'highest_bid' => $this->highest_bid,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'product' => $this->product ? [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'price' => $this->product->price,
            ] : null,
            'user' => new UserResource($this->user),
        ];
    }
}
