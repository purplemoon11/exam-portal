import { Country } from "../../../entity/country.entity";
import datasource from "../../../../config/ormConfig";
import { FindOneOptions } from "typeorm";
import { Request, Response } from "express";
import { Cluster } from "../../../entity/admin/Master-Data/cluster.entity";

export async function createCluster(req: Request, res: Response) {
  try {
    const { cluster_name, cluster_code, country_ids, description } = req.body;

    // Validate if all required fields are present in the request body
    if (!cluster_name || !cluster_code || !country_ids || !description) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const clusterRepository = datasource.getRepository(Cluster);
    const countryRepository = datasource.getRepository(Country);

    // Fetch the countries based on the provided country_ids
    const countries = await countryRepository.findByIds(country_ids);

    // Check if all countries with the given IDs exist
    if (countries.length !== country_ids.length) {
      res.status(404).json({ error: "Invalid country IDs" });
      return;
    }

    // Create a new cluster object with the provided data
    const newCluster = new Cluster();
    newCluster.cluster_name = cluster_name;
    newCluster.cluster_code = cluster_code;
    newCluster.description = description;
    newCluster.countries = countries; // Assign the array of country objects to the cluster's countries property

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
      .leftJoinAndSelect("cluster.countries", "countries") // Load related countries
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
    const { cluster_name, cluster_code, country_ids, description } = req.body;

    if (!cluster_name || !cluster_code || !country_ids || !description) {
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

    const countries = await countryRepository.findByIds(country_ids);

    if (countries.length !== country_ids.length) {
      res.status(404).json({ error: "Invalid country IDs" });
      return;
    }

    existingCluster.cluster_name = cluster_name;
    existingCluster.cluster_code = cluster_code;
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
