import RootLayout from "@/src/app/page";
import FlowCreation from "../../../../../Bpms/Pages/Dashboard/Flows";

export default function tasksOpenedByMe() {
  return (
    <>
      <RootLayout>
      <div>
          <h1>Task OPened By Me</h1>
        </div>
        <FlowCreation />
      </RootLayout>
    </>
  );
}
