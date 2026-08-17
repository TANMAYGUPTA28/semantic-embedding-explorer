const ImageVector = require('../models/ImageVector');

// Cosine similarity computation between two vectors
function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

// 1. Health Check
exports.getHealth = async (req, res) => {
  try {
    const totalIndexed = await ImageVector.countDocuments().catch(() => 0);
    res.json({
      status: 'online',
      stack: 'MERN (MongoDB + Express + React + Node.js)',
      engine: 'MongoDB Atlas Vector Search',
      totalIndexedImages: totalIndexed,
      dimension: 512,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Retrieve Top-K Nearest Neighbors
exports.retrieveTopK = async (req, res) => {
  try {
    const { queryVector, topK = 10 } = req.body;
    const k = parseInt(topK, 10);

    if (!queryVector || !Array.isArray(queryVector)) {
      return res.status(400).json({ error: 'Valid queryVector array is required' });
    }

    // Try MongoDB Atlas $vectorSearch Aggregation Pipeline
    try {
      const atlasResults = await ImageVector.aggregate([
        {
          $vectorSearch: {
            index: 'vector_index',
            path: 'embedding',
            queryVector: queryVector,
            numCandidates: 150,
            limit: k
          }
        },
        {
          $project: {
            _id: 1,
            filename: 1,
            category: 1,
            thumbUrl: 1,
            width: 1,
            height: 1,
            source: 1,
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ]);

      if (atlasResults && atlasResults.length > 0) {
        const formatted = atlasResults.map((item, idx) => ({
          rank: idx + 1,
          cos: item.score,
          item: {
            id: item._id.toString(),
            filename: item.filename,
            category: item.category,
            thumb: item.thumbUrl,
            width: item.width,
            height: item.height,
            source: item.source
          }
        }));
        return res.json({ results: formatted, engine: 'MongoDB Atlas $vectorSearch' });
      }
    } catch (atlasErr) {
      // Fallback: Local exact in-memory cosine search if Atlas index is not configured
    }

    // High-performance In-Memory search fallback
    const allImages = await ImageVector.find().lean();
    if (allImages.length === 0) {
      return res.json({ results: [], engine: 'In-Memory Empty' });
    }

    const scored = allImages.map((doc) => ({
      item: {
        id: doc._id.toString(),
        filename: doc.filename,
        category: doc.category,
        thumb: doc.thumbUrl,
        width: doc.width,
        height: doc.height,
        source: doc.source
      },
      cos: cosineSimilarity(queryVector, doc.embedding),
    }));

    scored.sort((a, b) => b.cos - a.cos);
    const topResults = scored.slice(0, k).map((res, idx) => ({
      ...res,
      rank: idx + 1
    }));

    res.json({ results: topResults, engine: 'MERN In-Memory Exact Cosine Engine' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Ingest Batch Image Dataset
exports.ingestDataset = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Array of items required' });
    }

    const docs = items.map((item) => ({
      filename: item.filename,
      category: item.category,
      thumbUrl: item.thumb,
      width: item.width || 1024,
      height: item.height || 768,
      source: item.source || 'Dataset',
      embedding: item.vector
    }));

    await ImageVector.deleteMany({}); // Reset collection
    const inserted = await ImageVector.insertMany(docs);

    res.json({
      success: true,
      insertedCount: inserted.length,
      message: `Successfully indexed ${inserted.length} image vectors in MongoDB!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Fetch All Dataset Documents
exports.getAllVectors = async (req, res) => {
  try {
    const docs = await ImageVector.find().lean();
    res.json({ count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
