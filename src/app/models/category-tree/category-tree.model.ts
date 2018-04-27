import { Category } from '../category/category.model';

export interface CategoryTree {
  nodes: { [id: string]: Category };
  rootIds: string[];
  edges: { [id: string]: string[] };
}

export * from './category-tree.helper';
