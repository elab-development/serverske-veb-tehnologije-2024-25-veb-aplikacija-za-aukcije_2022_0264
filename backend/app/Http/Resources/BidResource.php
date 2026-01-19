<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidResource extends JsonResource
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
            'amount' => $this->amount,
            'auction_id' => $this->auction_id,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->user),
            'auction' => new AuctionResource($this->auction),
        ];
    }
}
