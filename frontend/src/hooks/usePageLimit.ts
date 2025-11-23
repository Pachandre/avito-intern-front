import useLocalStorage from "use-local-storage";

export default function usePageLimit() {
    const [pageLimit, setPageLimit] = useLocalStorage<number>("page-limit", 10);
    return { pageLimit, setPageLimit };
}
