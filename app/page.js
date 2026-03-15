{results.length > 0 && (
  <div className="rounded-2xl border p-4 shadow-sm bg-white">
    <h2 className="text-xl font-semibold">{results[0].name}</h2>
    <p><strong>Address:</strong> {results[0].address || "N/A"}</p>
    <p><strong>Phone:</strong> {results[0].phone || "N/A"}</p>
    <p><strong>Website:</strong> {results[0].website || "No website"}</p>
    <p><strong>Category:</strong> {results[0].category || "N/A"}</p>
    <p><strong>Maps:</strong> {results[0].googleMapsUrl ? (
      <a
        href={results[0].googleMapsUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        Open in Google Maps
      </a>
    ) : "N/A"}</p>
  </div>
)}
