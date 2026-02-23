<?php

namespace Tests\Unit;

use App\Models\Auction;
use Carbon\Carbon;
use Tests\TestCase;

class AuctionIsActiveTest extends TestCase
{
    public function test_is_active_returns_true_when_now_is_between_start_and_end(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-01-01 12:00:00'));

        $auction = new Auction([
            'start_time' => Carbon::parse('2026-01-01 11:00:00'),
            'end_time' => Carbon::parse('2026-01-01 13:00:00'),
        ]);

        $this->assertTrue($auction->isActive());
    }

    public function test_is_active_returns_false_when_now_is_before_start(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-01-01 10:00:00'));

        $auction = new Auction([
            'start_time' => Carbon::parse('2026-01-01 11:00:00'),
            'end_time' => Carbon::parse('2026-01-01 13:00:00'),
        ]);

        $this->assertFalse($auction->isActive());
    }

    public function test_is_active_returns_false_when_now_is_after_end(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-01-01 14:00:00'));

        $auction = new Auction([
            'start_time' => Carbon::parse('2026-01-01 11:00:00'),
            'end_time' => Carbon::parse('2026-01-01 13:00:00'),
        ]);

        $this->assertFalse($auction->isActive());
    }

    public function test_is_active_returns_false_when_dates_missing(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-01-01 12:00:00'));

        $auction = new Auction([
            'start_time' => null,
            'end_time' => null,
        ]);

        $this->assertFalse($auction->isActive());
    }
}