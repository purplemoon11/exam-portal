import { Router } from "express";
import {
  createCluster,
  deleteCluster,
  getAllClusters,
  getClusterById,
} from "../../../controllers/admin/Master-Data/cluster.controller";

const router = Router();

router.get("/cluster", getAllClusters);
router.get("/cluster/:id", getClusterById);
router.post("/cluster", createCluster);
router.delete("/cluster/:id", deleteCluster);

export default router;
