import { Router, Response, Request } from "express";
import { FolderModel } from "../models/schema";
import authMiddleware from "../middleware/authMiddleware";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const folderRouter = Router();

folderRouter.use(authMiddleware);

// Create folder
folderRouter.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, parent } = req.body;
    if (!name) return res.status(400).send("Folder name is required");

    const folder = await FolderModel.create({
      name,
      parent: parent || null,
      owner: req.user!.id,
    });

    res.status(201).json(folder);
  } catch (err) {
    res.status(500).send("Failed to create folder");
  }
});

// List folders (top-level or children of a folder)
folderRouter.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { parent } = req.query;
    const filter: any = { owner: req.user!.id, parent: parent || null };
    const folders = await FolderModel.find(filter).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    res.status(500).send("Failed to fetch folders");
  }
});


folderRouter.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const folder = await FolderModel.findOne({ _id: req.params.id, owner: req.user!.id });
    if (!folder) return res.status(404).send("Folder not found");

    const children = await FolderModel.find({ parent: folder._id, owner: req.user!.id });
    res.json({ folder, children });
  } catch (err) {
    res.status(500).send("Failed to fetch folder");
  }
});

// Rename or move folder
folderRouter.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { name, parent } = req.body;

    const folder = await FolderModel.findOne({ _id: req.params.id, owner: req.user!.id });
    if (!folder) return res.status(404).send("Folder not found");

    if (name) folder.name = name;
    if (parent !== undefined) folder.parent = parent;

    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).send("Failed to update folder");
  }
});

// Delete folder 
folderRouter.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const folder = await FolderModel.findOneAndDelete({ _id: req.params.id, owner: req.user!.id });
    if (!folder) return res.status(404).send("Folder not found");

    // Optionally, delete children folders and images here
    await FolderModel.deleteMany({ parent: folder._id, owner: req.user!.id });

    res.status(200).send("Folder deleted");
  } catch (err) {
    res.status(500).send("Failed to delete folder");
  }
});

export default folderRouter;
