import { Router } from "express";

import { CategoriesRepository } from "../modules/cars/repositories/CategoriesRepository";

import { ListCategoryService } from "../modules/cars/services/ListCategoryService";
import { CreateCategoryService } from "../modules/cars/services/CreateCategoryService";

const categoriesRoutes = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRoutes.get("/", (request, response) => {
    const listCategoryService = new ListCategoryService(categoriesRepository);

    const categories = listCategoryService.execute();

    return response.json(categories);
});

categoriesRoutes.post("/", (request, response) => {
    try {
        const { name, description } = request.body;

        const createCategoryService = new CreateCategoryService(categoriesRepository);
    
        createCategoryService.execute({ name, description });
    
        return response.status(201).send();
    } catch (error) {
        return response.status(error.status).json({ message: error.message });
    }
});

export { categoriesRoutes };
