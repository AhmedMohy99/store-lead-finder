export default function LeadTable({ items }) {
  if (!items?.length) return null;

  return (
    <div className="table-wrap card">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Business Name</th>
            <th>Keyword</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Has Website</th>
            <th>Website</th>
            <th>Google Maps</th>
            <th>Rating</th>
            <th>Reviews</th>
            <th>Business Status</th>
            <th>Types</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.businessName}-${item.address}-${index}`}>
              <td>{index + 1}</td>
              <td>{item.businessName}</td>
              <td>{item.keyword}</td>
              <td>{item.address}</td>
              <td>{item.phoneNumber || '—'}</td>
              <td className={item.hasWebsite === 'Yes' ? 'status-yes' : 'status-no'}>
                {item.hasWebsite}
              </td>
              <td>
                {item.website ? (
                  <a href={item.website} target="_blank" rel="noreferrer">
                    Open Website
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td>
                {item.mapsUrl ? (
                  <a href={item.mapsUrl} target="_blank" rel="noreferrer">
                    Maps Link
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td>{item.rating || '—'}</td>
              <td>{item.totalReviews || '—'}</td>
              <td>{item.businessStatus || '—'}</td>
              <td>{item.types || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
