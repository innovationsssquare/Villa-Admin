
export default function handler(req, res) {
  // This endpoint will just respond with a success message to keep the server alive
  res.status(200).json({ message: 'Server is alive!' });
}
