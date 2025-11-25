import NotificationPopover from "@/components/notification/NotificationPopover";
import PushManager from "@/components/notification/PushManager";
import StockOverview from "@/components/stock/StockOverview";

const stock = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold mb-4">StockOverview</h1>

        <div className="flex items-center gap-3">
          <PushManager />
          <NotificationPopover />
        </div>
      </div>

      <StockOverview />
    </div>
  );
};

export default stock;
