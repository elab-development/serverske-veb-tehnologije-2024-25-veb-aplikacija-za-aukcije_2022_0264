import { useMemo } from "react";
import { Chart } from "react-google-charts";

type Auction = {
  id: number;
  title?: string;
  name?: string;
};

type Bid = {
  auction_id?: number;
  auctionId?: number;
  auction?: { id?: number; title?: string; name?: string };
};

type Props = {
  auctions: Auction[];
  bids: Bid[];
  topN?: number;
};

export default function TopAuctionsByBidsChart({ auctions, bids, topN = 6 }: Props) {
  const data = useMemo(() => {
    const counts = new Map<number, number>();

    for (const b of bids ?? []) {
      const id =
        b.auction_id ??
        b.auctionId ??
        b.auction?.id;

      if (!id) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

   
    const nameById = new Map<number, string>();
    for (const a of auctions ?? []) {
      nameById.set(a.id, a.title || a.name || `Aukcija #${a.id}`);
    }

    
    const rows = Array.from(counts.entries())
      .map(([auctionId, count]) => ({
        name: nameById.get(auctionId) ?? `Aukcija #${auctionId}`,
        count,
      }))
      .sort((x, y) => y.count - x.count)
      .slice(0, topN);

    // ako nema bidova
    if (rows.length === 0) return [["Aukcija", "Bidovi"], ["Nema podataka", 0]];

    return [
      ["Aukcija", "Bidovi"],
      ...rows.map((r) => [r.name, r.count]),
    ];
  }, [auctions, bids, topN]);

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="300px"
      data={data}
      options={{
        pieHole: 0.4,
        legend: { position: "none" },
        chartArea: { width: "65%", height: "75%" },
        hAxis: { minValue: 0 },
      }}
    />
  );
}
