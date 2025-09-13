interface StatusSelectProps {
  statusList: { status: string }[];
  handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>): void;
  selectedStatus: string | null;
}

export function StatusSelect(props: StatusSelectProps) {
  const { statusList, handleStatusChange, selectedStatus } = props;

  return (
    <select
      className="border border-gray-500 rounded p-2 mt-2"
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
        handleStatusChange(event)
      }
      value={selectedStatus || ""}
    >
      <option value="">All</option>
      {statusList.map((status) => (
        <option key={status.status} value={status.status}>
          {status.status}
        </option>
      ))}
    </select>
  );
}
