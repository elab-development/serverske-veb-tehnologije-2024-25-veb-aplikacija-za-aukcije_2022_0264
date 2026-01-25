<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Models\Auction;
use App\Models\Bid;

class NotifyWinnerOnAuctionEnd extends Command
{
    protected $signature = 'auctions:notify-winner-on-end';
    protected $description = 'Posalji majl korisniku koji je dao najvecu ponudu na aukciju koja je istekla';

    public function handle(): int
    {
        
        $endedAuctions = Auction::query()
            ->whereNotNull('end_time')
            ->where('end_time', '<=', now())
            ->whereHas('bids')
            ->get(['id', 'title', 'end_time', 'highest_bid', 'product_id']);

        $sent = 0;

        foreach ($endedAuctions as $auction) {
            
            $cacheKey = "auction_winner_notified:{$auction->id}";
            if (!Cache::add($cacheKey, true, now()->addDays(30))) {
                continue;
            }

            
            $winningBid = Bid::with('user')
                ->where('auction_id', $auction->id)
                ->orderByDesc('amount')
                ->first();

            if (!$winningBid || !$winningBid->user || !$winningBid->user->email) {
                continue;
            }

            $winner = $winningBid->user;

            Mail::raw(
                "Aukcija je istekla, a vi imate najveću ponudu.\n\n"
                . "Aukcija ID: {$auction->id}\n"
                . "Naziv: {$auction->title}\n"
                . "Kraj aukcije: {$auction->end_time}\n"
                . "Vaša ponuda: {$winningBid->amount}\n"
                . "Najveća cena prikazana u aukciji (highest_bid): " . ($auction->highest_bid ?? 'N/A') . "\n",
                function ($m) use ($winner, $auction) {
                    $m->to($winner->email)
                      ->subject("Pobedili ste na aukciji: {$auction->title}");
                }
            );

            $sent++;
        }

        $this->info("Sent {$sent} winner email(s).");
        return 0;
    }
}
