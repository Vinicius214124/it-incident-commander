
import { NewIncidentForm } from "@/components/incidents/NewIncidentForm";

export default function NewIncident() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Create New Incident</h1>
      <NewIncidentForm />
    </div>
  );
}
