import { ref, onMounted } from 'vue';

export function useInteractionMemory() {
  const getRecord = (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) === 'true';
  };

  const setRecord = (key: string, value: boolean) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, String(value));
  };

  const markNodeViewed = (nodeId: string) => {
    setRecord(`node_viewed_${nodeId}`, true);
    window.dispatchEvent(new CustomEvent('ctos-memory-update', { detail: { type: 'node', id: nodeId } }));
  };

  const isNodeViewed = (nodeId: string) => getRecord(`node_viewed_${nodeId}`);

  const markCaseStudyVisited = (slug: string) => {
    setRecord(`casestudy_visited_${slug}`, true);
    window.dispatchEvent(new CustomEvent('ctos-memory-update', { detail: { type: 'casestudy', id: slug } }));
  };

  const isCaseStudyVisited = (slug: string) => getRecord(`casestudy_visited_${slug}`);

  const totalVisitedNodesCount = () => {
    if (typeof window === 'undefined') return 0;
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('node_viewed_') && localStorage.getItem(key) === 'true') {
        count++;
      }
    }
    return count;
  };

  return {
    markNodeViewed,
    isNodeViewed,
    markCaseStudyVisited,
    isCaseStudyVisited,
    totalVisitedNodesCount,
    getRecord,
    setRecord
  };
}
