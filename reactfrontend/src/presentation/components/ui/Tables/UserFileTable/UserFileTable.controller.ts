import { useTableController } from "../Table.controller";
import { useUserFileApi } from "@infrastructure/apis/api-management";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePaginationController } from "../Pagination.controller";
import { downloadDocument, openDocument } from "@infrastructure/utils/downloadUtils";
import { UserFileDTO } from "@infrastructure/apis/client";

const getFileContent = (filename?: string) => {
    if (!filename) {
        return;
    }

    if (filename.endsWith(".pdf")) {
        return "application/pdf";
    }
}

/**
 * This is controller hook manages the table state including the pagination and data retrieval from the backend.
 */
export const useUserFileTableController = () => {
    const { getUserFiles: { key: queryKey, query }, downloadUserFile: { query: download } } = useUserFileApi(); // Use the API hook.
    const queryClient = useQueryClient(); // Get the query client.
    const { page, pageSize, setPagination } = usePaginationController(); // Get the pagination state.
    const { data, isError, isLoading } = useQuery({
        queryKey: [queryKey, page, pageSize],
        queryFn: () => query({ page, pageSize })
    }); // Retrieve the table page from the backend via the query hook.
    const downloadUserFile = useCallback((userFile: UserFileDTO) => download(userFile.id ?? '')
        .then((data) => downloadDocument(data, userFile.name ?? '')), [download]); // Create the callback to download the user file.
    const openUserFile = useCallback((userFile: UserFileDTO) => download(userFile.id ?? '')
        .then((data) => userFile.name?.endsWith(".pdf") ? openDocument(data, getFileContent(userFile.name)) : openDocument(data)), [download]); // Create the callback to open the user file in another tab.

    const tryReload = useCallback(
        () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
        [queryClient, queryKey]); // Create a callback to try reloading the data for the table via query invalidation.

    const tableController = useTableController(setPagination, data?.response?.pageSize); // Adapt the pagination for the table.

    return { // Return the controller state and actions.
        ...tableController,
        tryReload,
        pagedData: data?.response,
        isError,
        isLoading,
        downloadUserFile,
        openUserFile
    };
}