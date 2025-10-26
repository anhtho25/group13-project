import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Component nhỏ để theo dõi lịch sử điều hướng nội bộ của SPA
// Lưu vào sessionStorage các stack: appNavStack (history), appNavFuture (forward)
export default function NavTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      const path = location.pathname + location.search;

      // lấy action do BackButton/Forward set trước khi navigate
      const action = sessionStorage.getItem('appNavAction');

      const stackRaw = sessionStorage.getItem('appNavStack');
      const futureRaw = sessionStorage.getItem('appNavFuture');
      const stack = stackRaw ? JSON.parse(stackRaw) : [];
      const future = futureRaw ? JSON.parse(futureRaw) : [];

      if (!action) {
        // normal navigation: clear future stack (new branch)
        if (future.length > 0) {
          sessionStorage.setItem('appNavFuture', JSON.stringify([]));
        }

        // push current if different from last
        if (stack[stack.length - 1] !== path) {
          stack.push(path);
          // keep stack reasonably bounded
          if (stack.length > 50) stack.shift();
          sessionStorage.setItem('appNavStack', JSON.stringify(stack));
        }
      } else {
        // if action was set by BackButton/Forward, just clear flag
        sessionStorage.removeItem('appNavAction');
      }
    } catch (err) {
      // ignore
      console.error('NavTracker error', err);
    }
  }, [location.pathname, location.search]);

  return null;
}
