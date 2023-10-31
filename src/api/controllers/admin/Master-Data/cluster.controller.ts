import { Cluster } from "../../../entity/admin/Master-Data/cluster.entity";
import { Country } from "../../../entity/country.entity";
import datasource from "../../../../config/ormConfig";
import { FindOneOptions } from "typeorm";
import { Request, Response } from "express";

export async function createCluster(
  req: Request,
  res: Response
): Promise<void> {
  const { clusterData, countryId } = req.body;

  const clusterRepository = datasource.getRepository(Cluster);
  const countryRepository = datasource.getRepository(Country);

  try {
    const country = await countryRepository.findOne(countryId);

    if (!country) {
      throw new Error("Country not found");
    }

    const newCluster = new Cluster();
    newCluster.cluster_name = clusterData.cluster_name;
    newCluster.cluster_code = clusterData.cluster_code;
    newCluster.description = clusterData.description;
    newCluster.country = country;

    const createdCluster = await clusterRepository.save(newCluster);

    res.status(201).json({
      message: "Cluster created successfully",
      cluster: createdCluster,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCluster(
  req: Request,
  res: Response
): Promise<void> {
  const clusterId: number = parseInt(req.params.id);
  const clusterRepository = datasource.getRepository(Cluster);

  try {
    const result = await clusterRepository.delete(clusterId);

    if (result.affected === 0) {
      throw new Error("Cluster not found");
    }

    res.status(200).json({ message: "Cluster deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getClusterById(
  req: Request,
  res: Response
): Promise<void> {
  const clusterId: number = parseInt(req.params.id);
  const clusterRepository = datasource.getRepository(Cluster);

  try {
    const options: FindOneOptions<Cluster> = {
      where: { id: clusterId },
    };

    const cluster = await clusterRepository.findOne(options);

    if (!cluster) {
      res.status(404).json({ error: "Cluster not found" });
      return;
    }

    res.status(200).json({ cluster });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllClusters(
  req: Request,
  res: Response
): Promise<void> {
  const clusterRepository = datasource.getRepository(Cluster);

  try {
    const clusters = await clusterRepository.find();

    res.status(200).json({ clusters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
