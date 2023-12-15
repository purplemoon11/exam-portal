import { Country } from "../../../entity/country.entity";
import datasource from "../../../../config/ormConfig";
import { FindOneOptions } from "typeorm";
import { Request, Response } from "express";
import { Cluster } from "../../../entity/admin/Master-Data/cluster.entity";
import ormConfig from "../../../../config/ormConfig";
const clusterRepo = ormConfig.getRepository(Cluster);
export async function createCluster(req: Request, res: Response) {
  try {
    const { cluster_name, cluster_code, country_id, description } = req.body;

    // Validate if all required fields are present in the request body
    if (!cluster_name || !cluster_code || !country_id || !description) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const clusterRepository = datasource.getRepository(Cluster);
    const countryRepository = datasource.getRepository(Country);

    // Fetch the countries based on the provided country_id
    const countries = await countryRepository.findByIds(country_id);

    // Check if all countries with the given IDs exist
    if (countries.length !== country_id.length) {
      res.status(404).json({ error: "Invalid country IDs" });
      return;
    }

    // Create a new cluster object with the provided data
    const newCluster = new Cluster();
    newCluster.cluster_name = cluster_name;
    newCluster.isGeneral = req.body.isGeneral;
    newCluster.cluster_code = cluster_code;
    newCluster.description = description;

    // Assign the array of country objects to the cluster's countries property
    newCluster.countries = countries;

    // Assign the first country's ID to the country_id column (you might want to adjust this based on your logic)
    newCluster.country_id = countries[0].id;

    // Save the new cluster to the database
    const createdCluster = await clusterRepository.save(newCluster);

    res.status(201).json({
      message: "Cluster created successfully",
      cluster: createdCluster,
    });
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
    const cluster = await clusterRepository
      .createQueryBuilder("cluster")
      .leftJoinAndSelect("cluster.countries", "countries")
      .where("cluster.id = :id", { id: clusterId })
      .select([
        "cluster.id",
        "cluster.cluster_name",
        "cluster.cluster_code",
        "cluster.description",
        "countries.id",
        "countries.country_name",
        "countries.contact_person",
        "countries.phone_number",
        "countries.embassy_ph_number",
        "countries.media_file",
        "countries.embassy_address",
      ])
      .getOne();

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
    const clusters = await clusterRepository
      .createQueryBuilder("cluster")
      .leftJoinAndSelect("cluster.countries", "countries") // Load related countries
      .select([
        "cluster.id",
        "cluster.cluster_name",
        "cluster.cluster_code",
        "cluster.description",
        "countries.id",
        "countries.country_name",
        "countries.contact_person",
        "countries.phone_number",
        "countries.embassy_ph_number",
        "countries.media_file",
        "countries.embassy_address",
      ])
      .getMany();

    res.status(200).json({ clusters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCluster(req: Request, res: Response) {
  try {
    const clusterId: number = parseInt(req.params.id);
    const { cluster_name, cluster_code, country_id, description } = req.body;

    if (!cluster_name || !cluster_code || !country_id || !description) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const clusterRepository = datasource.getRepository(Cluster);
    const countryRepository = datasource.getRepository(Country);

    const existingCluster: Cluster | undefined =
      await clusterRepository.findOneBy({ id: clusterId });

    if (!existingCluster) {
      res.status(404).json({ error: "Cluster not found" });
      return;
    }

    const countries = await countryRepository.findByIds(country_id);

    if (countries.length !== country_id.length) {
      res.status(404).json({ error: "Invalid country IDs" });
      return;
    }

    existingCluster.cluster_name = cluster_name;
    existingCluster.cluster_code = cluster_code;
    existingCluster.isGeneral = req.body.isGeneral;
    existingCluster.description = description;
    existingCluster.countries = countries;

    const updatedCluster = await clusterRepository.save(existingCluster);

    res.status(200).json({
      message: "Cluster updated successfully",
      cluster: updatedCluster,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteClusterById(
  req: Request,
  res: Response
): Promise<void> {
  const clusterId: number = parseInt(req.params.id);
  const clusterRepository = datasource.getRepository(Cluster);

  try {
    const clusterToRemove = await clusterRepository.findOneBy({
      id: clusterId,
    });

    if (!clusterToRemove) {
      res.status(404).json({ error: "Cluster not found" });
      return;
    }

    await clusterRepository.remove(clusterToRemove);
    res.status(200).json({ message: "Cluster deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getGeneralCluster = async (req: Request, res: Response) => {
  try {
    const generalClusters = await clusterRepo.find({
      where: { isGeneral: true },
    });
    if (generalClusters.length === 0 || !generalClusters) {
      return res.status(404).json({ message: "No any general cluster found" });
    }
    return res.status(200).json(generalClusters);
  } catch (err: any) {
    return res.status(400).json({ errorMessage: err.message });
  }
};
