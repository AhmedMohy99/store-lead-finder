const handleSearch = async () => {
  try {
    setLoading(true);
    setError("");
    setResults([]);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city,
        country,
        keyword,
const [maxResults, setMaxResults] = useState(1);
                           noWebsiteOnly,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to search businesses.");
    }

    setResults(Array.isArray(data.results) ? data.results : []);
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};
