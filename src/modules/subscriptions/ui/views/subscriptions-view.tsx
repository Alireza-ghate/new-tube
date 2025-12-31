import SubscriptionsSection from "../sections/subscriptions-section";

function SubscriptionsView() {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">All subscriptions</h1>
        <p className="text-muted-foreground text-xs">
          View and manage your subscriptions
        </p>
      </div>

      <SubscriptionsSection />
    </div>
  );
}

export default SubscriptionsView;
