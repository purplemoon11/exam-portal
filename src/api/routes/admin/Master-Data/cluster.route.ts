import { Router } from "express";
import {
  createCluster,
  deleteClusterById,
  getAllClusters,
  getClusterById,
  getGeneralCluster,
  updateCluster,
} from "../../../controllers/admin/Master-Data/cluster.controller";
import { isAdmin } from "../../../middlewares/isAdmin.middleware";

const router = Router();

router.get("/cluster", getAllClusters);
router.get("/general-cluster", getGeneralCluster);

router.get("/cluster/:id", getClusterById);
router.post("/cluster", isAdmin, createCluster);
router.put("/cluster/:id", isAdmin, updateCluster);
router.delete("/cluster/:id", isAdmin, deleteClusterById);

export default router;
