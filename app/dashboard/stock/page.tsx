import NotificationPopover from "@/components/notification/NotificationPopover";
import StockOverview from "@/components/stock/StockOverview";

export default function stock() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold mb-4">StockOverview</h1>

        <div className="flex items-center gap-3">
          <NotificationPopover />
        </div>
      </div>

      <StockOverview />
    </div>
  );
}
