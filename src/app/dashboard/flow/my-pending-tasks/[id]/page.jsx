import RootLayout from "@/src/app/page";
import FlowCreation from "../../../../../Bpms/Pages/Dashboard/Flows";

export default function myPendingTasks() {
  return (
    <>
      <RootLayout>
        <div>
          <h1>My Pending Task</h1>
        </div>
        <FlowCreation />
      </RootLayout>
    </>
  );
}
