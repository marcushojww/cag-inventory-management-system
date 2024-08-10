import React from "react";
import Layout from "./layout/Layout";
import InventoryOverview from "./components/inventory-overview/InventoryOverview";
import CategoryOverview from "./components/category-overview/CategoryOverview";
import useQueryCategories from "./hooks/useQueryCategories";
import InventoryForm from "./components/form/InventoryForm";
import useQueryAllItems from "./hooks/useQueryAllItems";
import InventoryItemTable from "./components/table/InventoryItemTable";

function App() {
  const { isPending: categoriesLoading, data: categories } =
    useQueryCategories();

  const { data: allItems, isPending: allItemsLoading } = useQueryAllItems();

  return (
    <Layout>
      <div className="mt-8 flex justify-between w-[1000px]">
        <div className="flex flex-col gap-5 min-w-96">
          <InventoryOverview
            categoriesLoading={categoriesLoading}
            categories={categories}
            allItemsLoading={allItemsLoading}
            allItems={allItems}
          />
          <CategoryOverview></CategoryOverview>
        </div>
        <div className="min-w-96">
          <InventoryForm />
        </div>
      </div>
      <div className="my-8 w-full flex justify-center">
        <InventoryItemTable
          categories={categories}
          categoriesLoading={categoriesLoading}
        />
      </div>
    </Layout>
  );
}

export default App;
