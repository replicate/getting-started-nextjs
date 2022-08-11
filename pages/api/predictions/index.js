export default async function handler(req, res) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of kuprel/min-dalle, fetched from:
      // https://replicate.com/kuprel/min-dalle/versions
      version:
        "2af375da21c5b824a84e1c459f45b69a117ec8649c2aa974112d7cf1840fc0ce",
      input: { text: req.body.prompt, grid_size: 1 },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
