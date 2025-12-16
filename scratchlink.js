// ===============================
// Scratch Link Parser for Mofury
// ===============================

const SCRATCH_USER_REGEX =
  /https?:\/\/scratch\.mit\.edu\/users\/([A-Za-z0-9_-]+)\/?/;

const SCRATCH_PROJECT_REGEX =
  /https?:\/\/scratch\.mit\.edu\/projects\/(\d+)\/?/;

/**
 * テキストからScratchリンクを検出
 */
export function parseScratchLink(text) {
  const userMatch = text.match(SCRATCH_USER_REGEX);
  if (userMatch) {
    return {
      type: "profile",
      id: userMatch[1]
    };
  }

  const projectMatch = text.match(SCRATCH_PROJECT_REGEX);
  if (projectMatch) {
    return {
      type: "project",
      id: projectMatch[1]
    };
  }

  return null;
}

/**
 * Scratch PJ 情報取得
 */
async function fetchScratchProject(projectId) {
  try {
    const res = await fetch(
      `https://api.scratch.mit.edu/projects/${projectId}`
    );
    if (!res.ok) return null;

    const data = await res.json();

    return {
      title: data.title,
      thumbnail: data.image
    };
  } catch {
    return null;
  }
}

/**
 * 投稿・DM用：Scratch展開データ生成
 */
export async function buildScratchData(text) {
  const scratch = parseScratchLink(text);

  if (!scratch) {
    return {
      scratch_type: null,
      scratch_id: null,
      scratch_title: null,
      scratch_thumb: null
    };
  }

  // プロフィール
  if (scratch.type === "profile") {
    return {
      scratch_type: "profile",
      scratch_id: scratch.id,
      scratch_title: null,
      scratch_thumb: null
    };
  }

  // プロジェクト
  if (scratch.type === "project") {
    const pj = await fetchScratchProject(scratch.id);

    return {
      scratch_type: "project",
      scratch_id: scratch.id,
      scratch_title: pj?.title ?? null,
      scratch_thumb: pj?.thumbnail ?? null
    };
  }
}
