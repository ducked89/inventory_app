import { PostCategorySchema } from "@/types/postCategory";
import {
  Accordion,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Skeleton,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import {
  useGetCategories,
  usePostCategories,
} from "../queries/CategoryQueries";
import { CustomeNextPage } from "../types/CustomNextPage";
import { GetCategory } from "../types/getCategories";
import { queryClient } from "./_app";

const Categories: CustomeNextPage = () => {
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const [selectData, setSelectData] = useState<GetCategory["name"][]>([]);
  const [selectValue, setSelectValue] = useState<GetCategory["name"] | null>();

  const [filteredValues, setFilteredValues] = useState<GetCategory[] | null>(
    null
  );
  // MODAL STATE
  const [createModal, setCreateModal] = useState<boolean>(false);

  // Set Select data for the Search category
  useEffect(() => {
    setSelectData([]);
    if (categories) {
      categories.map((ctg) =>
        setSelectData((selectData) => [...selectData, ctg.name])
      );
    }
    setFilteredValues(categories);
  }, [categories]);

  // Filter data by the selected value
  useEffect(() => {
    if (selectValue) {
      setFilteredValues(categories?.filter((ctg) => ctg.name === selectValue));
    } else {
      setFilteredValues(categories);
    }
  }, [selectValue, categories]);

  // VALIDATE THE DATA CATEGORY FORM
  const createCategoryForm = useForm({
    validate: zodResolver(PostCategorySchema),
    initialValues: {
      name: "",
    },
  });

  const { mutate: postCategory, isLoading: postCategoryLoading } =
    usePostCategories();

  return (
    <main>
      {/* Title */}
      <Group align="center" mb="3rem">
        <Title size="1.5rem" weight={500}>
          Your Categories
        </Title>
        <ThemeIcon variant="light" color="green" size="md">
          <BiCategory size={25} />
        </ThemeIcon>
      </Group>
      {/* Select component */}
      <Select
        data={selectData}
        value={selectValue}
        onChange={setSelectValue}
        clearable
        searchable
        nothingFound="No categories Found!"
        icon={<FiSearch />}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="ease"
        sx={{ maxWidth: "600px" }}
        mb="1.5rem"
      />

      {/* No Categories */}
      {categories?.length === 0 && !categoriesLoading && (
        <Box>
          <Group align="center">
            <Text size="lg">No Inventory/Categories!</Text>
            <FiSearch size={20} />
          </Group>
        </Box>
      )}

      {/* Accordion for the data */}
      <Skeleton
        mb="3rem"
        visible={categoriesLoading ?? false}
        style={{ minHeight: "80px" }}
      >
        <Accordion
          value={accordionValue}
          onChange={setAccordionValue}
          transitionDuration={500}
        >
          {filteredValues?.map((category: GetCategory, index) => (
            <Accordion.Item
              value={category.name}
              sx={{ overflowX: "auto" }}
              key={index}
            >
              <Accordion.Control>{category.name}</Accordion.Control>
              <Accordion.Panel sx={{ width: "max-content", minWidth: "100%" }}>
                <Table verticalSpacing="md" horizontalSpacing="md">
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: "0" }}>Name</th>
                      <th style={{ paddingLeft: "0" }}>Price</th>
                      <th style={{ paddingLeft: "0" }}>Id</th>
                      <th style={{ paddingLeft: "0" }}>Last Updated</th>
                      <th style={{ paddingLeft: "0" }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category?.Product?.map((prod, index) => (
                      <tr key={index}>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            {prod.name}
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            {prod.price}
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>{prod.id}</div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            {prod.lastUpdate.toString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            {prod?.date[0]?.stock ?? 0}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Group>
                  <Button my="1.5rem" color="blue">
                    Change Details
                  </Button>
                  <Button my="1.5rem" color="red">
                    Delete
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Skeleton>

      <Box>
        <Button
          color="blue"
          variant="outline"
          onClick={() => setCreateModal(true)}
        >
          Create Category
        </Button>
      </Box>

      {/* Modal */}
      {/* Create Category */}
      <Modal
        centered
        opened={createModal}
        onClose={() => setCreateModal(false)}
        title="Create Category"
      >
        <form
          onSubmit={createCategoryForm.onSubmit((values: any) => {
            postCategory(values, {
              onSuccess: () => {
                setCreateModal(false);
                queryClient.refetchQueries(["categories"]);
              },
            });
          })}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={postCategoryLoading ?? false}
            overlayBlur={2}
          />
          <TextInput
            placeholder="Category name"
            label="Category name"
            withAsterisk
            mb="1rem"
            {...createCategoryForm.getInputProps("name")}
          />
          <Group noWrap={false}>
            <Button type="submit">Create</Button>
            <Button color="red" onClick={() => setCreateModal(false)}>
              Exit
            </Button>
          </Group>
        </form>
      </Modal>
    </main>
  );
};

export default Categories;
Categories.requireAuth = true;
