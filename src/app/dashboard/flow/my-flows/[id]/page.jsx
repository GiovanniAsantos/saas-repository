import RootLayout from "@/src/app/page";
import FlowCreation from "../../../../../Bpms/Pages/Dashboard/Flows";

export default function myFlow() {
  return (
    <>
      <RootLayout>
        <div>
          <h1>My Flows</h1>
        </div>
        <FlowCreation />
      </RootLayout>
    </>
  );
}
