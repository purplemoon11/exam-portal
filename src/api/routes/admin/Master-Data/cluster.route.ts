import { Router } from "express";
import {
  createCluster,
  deleteClusterById,
  getAllClusters,
  getClusterById,
  updateCluster,
} from "../../../controllers/admin/Master-Data/cluster.controller";

const router = Router();

router.get("/cluster", getAllClusters);
router.get("/cluster/:id", getClusterById);
router.post("/cluster", createCluster);
router.put("/cluster/:id", updateCluster);
router.delete("/cluster/:id", deleteClusterById);

export default router;
