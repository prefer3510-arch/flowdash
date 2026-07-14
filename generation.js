// 닉네임 입력하면 수정 부분
const nickname = document.getElementById("nickname-display");
const MAX_LENGTH = 10;

// 엔터키 누르면 이벤트 발생하면서 이름 수정
nickname.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    nickname.blur();
  }
});

// 타이핑 할 때 실시간 글자 수 제한 부분
nickname.addEventListener("input", function () {
  if (nickname.textContent.length > MAX_LENGTH) {
    nickname.textContent = nickname.textContent.substring(0, MAX_LENGTH);

    // 여긴 입력 커서 위치 뒤로 유지
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(nickname);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

// 기본 복붙 차단하기
nickname.addEventListener("paste", function (evnet) {
  event.preventDefault();
});

// 입력창에서 벗어나면 입력한 닉네임 출력
nickname.addEventListener("blur", function () {
  const updateName = nickname.textContent.trim();

  // 만약 입력값이 공백이면 기본값 출력
  if (updateName === "") {
    nickname.innerText = "FlowDash";
    return;
  }

  console.log("수정된 닉네임:", updateName);
});

// 실시간 날짜 업데이트
const todayDate = document.getElementById("current-date");
function updateDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  todayDate.textContent = `${year}년 ${month}월 ${date}일`;
}

updateDateTime();

setInterval(updateDateTime, 1000 * 60);

// 윗 부분 새로 추가 ( 2026. 07. 13)

// HTML 태그(요소)들 정확하게 가져오기

const todoModal = document.getElementById("todo-modal");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const todoForm = document.getElementById("todo-form");

// 입력창 데이터 태그들
const todoTitleInput = document.getElementById("todo-title-input");
const todoContentInput = document.getElementById("todo-content-input");
const statusSelect = document.getElementById("todo-status-select");

// 카드가 들어갈 칸(리스트 상자)들
const todoList = document.getElementById("todo-list");
const doingList = document.getElementById("doing-list");
const doneList = document.getElementById("done-list");

// 대시보드 카운트 / 성취도 태그들 가져오기 (새로 기입 2026.07.10)
const statTotal = document.getElementById("stat-total");
const statTodo = document.getElementById("stat-todo");
const statDoing = document.getElementById("stat-doing");
const statDone = document.getElementById("stat-done");
const statAchievement = document.getElementById("stat-achievement");

// 현재 적용된 필터 조건을 표시할 요소 가져오기
const filterStatusText = document.getElementById("filter-status-text");

// 검색어가 표시될 div 만들기
const searchKeywordDisplay = document.getElementById("search-keyword-display");
// 검색창 요소 가져오기
const searchInput = document.getElementById("search-input");
// 실제 검색어가 표시될 span 가져오기
const searchValue = document.getElementById("search-value");
// 정렬 상태의 오름차순/내림차순 값
const sortStatusValue = document.getElementById("sort-status-value");

// 전체 데이터 초기화 버튼 선택
const clearAllBtn = document.getElementById("clear-all-btn");

// 삭제 확인 모달
const confirmModal = document.getElementById("confirm-modal");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");

// 삭제 확인 모달 버튼
const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
const confirmActionBtn = document.getElementById("confirm-action-btn");

// 전체 할 일 데이터를 저장하는 배열
const todos = [];

let currentEditId = null;

// 현재 선택된 기간 필터
let currentPeriodFilter = "all";

// 현재 선택된 우선순위 필터
let currentPriorityFilter = "all";

// 현재 입력된 검색어
let currentSearchKeyword = "";

// 모달 열기 / 닫기 함수 정의

function openModal(isEdit = false) {
  todoModal.classList.remove("hidden");

  const modalTitle = document.getElementById("modal-title");
  if (modalTitle) {
    if (isEdit === true) {
      modalTitle.textContent = "할 일 수정";
    } else {
      modalTitle.textContent = "새 할 일";
    }
  }
}

function closeModal() {
  todoModal.classList.add("hidden");
  todoForm.reset();
  currentEditId = null;
}

// 버튼에 이벤트 연결

if (openModalBtn) {
  openModalBtn.addEventListener("click", openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

// 저장하기 버튼을 눌렀을 때 처리

// 저장하기 버튼을 눌렀을 때 처리
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const titleValue = todoTitleInput.value.trim();
  const contentValue = todoContentInput.value.trim();

  const checkedPriority = document.querySelector(
    'input[name="priority"]:checked',
  );
  const priorityValue = checkedPriority ? checkedPriority.value : "mid";

  const statusValue = statusSelect.value;

  // 제목 없으면 안내하고 중단
  if (titleValue === "") {
    alert("제목을 입력해주세요!");
    todoTitleInput.focus();
    return;
  }

  // 새 할 일 데이터 생성
  const now = Date.now();

  // 수정 모드 추가
  if (currentEditId !== null) {
    const todoIndex = todos.findIndex(function (t) {
      return t.id === currentEditId;
    });

    if (todoIndex !== -1) {
      // 상태를 변경하기 전 기존 상태 저장
      const previousStatus = todos[todoIndex].status;

      todos[todoIndex].title = titleValue;
      todos[todoIndex].content = contentValue;
      todos[todoIndex].priority = priorityValue;

      // 다른 상태에서 진행 중으로 변경하면 시간 저장
      if (statusValue === "doing" && previousStatus !== "doing") {
        todos[todoIndex].doingAt = now;
      }

      // 완료 상태로 변경하면 완료 시간 저장
      if (statusValue === "done" && previousStatus !== "done") {
        todos[todoIndex].completedAt = now;
      } else if (statusValue !== "done") {
        todos[todoIndex].completedAt = null;
      }

      // 선택한 상태 저장
      todos[todoIndex].status = statusValue;
    }
  } else {
    const newTodo = {
      id: now,
      title: titleValue,
      content: contentValue,
      priority: priorityValue,
      status: statusValue,
      createdAt: now,

      // 처음부터 진행 중으로 등록했을 때 시간 저장
      doingAt: statusValue === "doing" ? now : null,

      completedAt: statusValue === "done" ? now : null,
    };

    todos.push(newTodo);
  }
  // 필터/정렬 조건에 맞게 화면 다시 그리기
  renderTodos();

  closeModal();
});

/// 전체기간, 전체우선순위, 정렬 ranking 07-09 ///

// 기간 드롭다운 전체 박스 선택
const dropdownPeriod = document.getElementById("dropdown-period");

// 우선순위 드롭다운 전체 박스 선택
const dropdownPriority = document.getElementById("dropdown-priority");

// 기간 드롭다운 버튼 선택
const periodToggleBtn = document.querySelector(
  "#dropdown-period .dropdown-toggle-btn",
);

// 우선순위 드롭다운 버튼 선택
const priorityToggleBtn = document.querySelector(
  "#dropdown-priority .dropdown-toggle-btn",
);

// 기간 버튼 안에 표시되는 선택 텍스트 선택
const periodSelectedLabel = document.querySelector(
  "#dropdown-period .selected-label",
);

// 우선순위 버튼 안에 표시되는 선택 텍스트 선택
const prioritySelectedLabel = document.querySelector(
  "#dropdown-priority .selected-label",
);

// 기간 메뉴 항목들 선택
const periodMenuItems = document.querySelectorAll(
  "#dropdown-period .dropdown-menu-list li",
);

// 우선순위 메뉴 항목들 선택
const priorityMenuItems = document.querySelectorAll(
  "#dropdown-priority .dropdown-menu-list li",
);

// 기간 버튼 클릭 시 기간 메뉴 열기/닫기
periodToggleBtn.addEventListener("click", function (event) {
  event.stopPropagation();

  // 우선순위 메뉴가 열려 있으면 닫기
  dropdownPriority.classList.remove("open");

  // 기간 메뉴 열기/닫기
  dropdownPeriod.classList.toggle("open");
});

// 우선순위 버튼 클릭 시 우선순위 메뉴 열기/닫기
priorityToggleBtn.addEventListener("click", function (event) {
  event.stopPropagation();

  // 기간 메뉴가 열려 있으면 닫기
  dropdownPeriod.classList.remove("open");

  // 우선순위 메뉴 열기/닫기
  dropdownPriority.classList.toggle("open");
});

// 기간 메뉴 항목 클릭 시 선택값 변경
periodMenuItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.stopPropagation();

    // 기존 선택 표시 제거
    periodMenuItems.forEach(function (menuItem) {
      menuItem.classList.remove("active");
    });

    // 클릭한 항목에 선택 표시 추가
    item.classList.add("active");

    // 버튼 텍스트를 클릭한 항목으로 변경
    periodSelectedLabel.textContent = item.textContent;

    // 선택한 기간 필터값 저장
    currentPeriodFilter = item.dataset.value;
    renderTodos();

    // 선택 후 기간 메뉴 닫기
    dropdownPeriod.classList.remove("open");
  });
});

// 우선순위 메뉴 항목 클릭 시 선택값 변경
priorityMenuItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.stopPropagation();

    // 기존 선택 표시 제거
    priorityMenuItems.forEach(function (menuItem) {
      menuItem.classList.remove("active");
    });

    // 클릭한 항목에 선택 표시 추가
    item.classList.add("active");

    // 버튼에 클릭한 항목의 글씨 표시
    prioritySelectedLabel.textContent = item.textContent.trim();

    // 클릭한 우선순위 값을 변수에 저장
    currentPriorityFilter = item.dataset.value;

    // 변경된 우선순위 조건으로 카드 다시 그리기
    renderTodos();

    // 선택 후 드롭다운 닫기
    dropdownPriority.classList.remove("open");
  });
});

// 화면 바깥 클릭 시 모든 드롭다운 닫기
document.addEventListener("click", function () {
  dropdownPeriod.classList.remove("open");
  dropdownPriority.classList.remove("open");
});

// 정렬 버튼 선택
const sortToggleBtn = document.getElementById("sort-toggle-btn");

// 정렬 버튼 클릭 시 오름차순/내림차순 변경
sortToggleBtn.addEventListener("click", function () {
  if (sortToggleBtn.dataset.sort === "asc") {
    sortToggleBtn.dataset.sort = "desc";
    sortToggleBtn.textContent = "정렬: 내림차순 ↓";

    // 아래 정렬 배지 값 변경
    sortStatusValue.textContent = "내림차순";
  } else {
    sortToggleBtn.dataset.sort = "asc";
    sortToggleBtn.textContent = "정렬: 오름차순 ↑";

    // 아래 정렬 배지 값 변경
    sortStatusValue.textContent = "오름차순";
  }

  renderTodos();
});

// (새로 기입 2026.07.10)
function updateDashboard() {
  const total = todos.length;

  // 각 상태(status)에 맞는 개수 계산 (새로 기입 2026.07.10)
  const todoNum = todos.filter(function (todo) {
    return todo.status === "todo";
  }).length;
  const doingNum = todos.filter(function (todo) {
    return todo.status === "doing";
  }).length;
  const doneNum = todos.filter(function (todo) {
    return todo.status === "done";
  }).length;

  // 성취도 계산 (전체 개수가 0일 때는 0%, 있을 때는 반올림 계산) (새로 기입 2026.07.10)
  const achievement = total === 0 ? 0 : Math.round((doneNum / total) * 100);

  // HTML 화면에 실시간으로 값 반영 (새로 기입 2026.07.10)
  if (statTotal) statTotal.textContent = total;
  if (statTodo) statTodo.textContent = todoNum;
  if (statDoing) statDoing.textContent = doingNum;
  if (statDone) statDone.textContent = doneNum;
  if (statAchievement) statAchievement.textContent = `${achievement}%`;
}

function renderTodos() {
  // 기존 카드 화면 비우기
  todoList.innerHTML = "";
  doingList.innerHTML = "";
  doneList.innerHTML = "";

  // 현재 검색어를 소문자로 변경
  const keyword = currentSearchKeyword.toLowerCase();

  // 현재 시간
  const now = Date.now();

  // 검색어, 기간, 우선순위 조건에 맞는 할 일만 남기기
  const filteredTodos = todos.filter(function (todo) {
    const title = (todo.title || "").toLowerCase();
    const content = (todo.content || "").toLowerCase();

    // 검색어 조건
    const matchesSearch =
      keyword === "" || title.includes(keyword) || content.includes(keyword);

    // 우선순위 조건
    const matchesPriority =
      currentPriorityFilter === "all" ||
      todo.priority === currentPriorityFilter;

    // 기간 조건
    let matchesPeriod = true;

    if (currentPeriodFilter === "today") {
      const today = new Date();
      const createdDate = new Date(todo.createdAt);

      matchesPeriod =
        today.getFullYear() === createdDate.getFullYear() &&
        today.getMonth() === createdDate.getMonth() &&
        today.getDate() === createdDate.getDate();
    } else if (currentPeriodFilter === "7days" || currentPeriodFilter === "7") {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      matchesPeriod = now - todo.createdAt <= sevenDays;
    } else if (
      currentPeriodFilter === "30days" ||
      currentPeriodFilter === "30"
    ) {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      matchesPeriod = now - todo.createdAt <= thirtyDays;
    }

    // 검색어, 우선순위, 기간 조건을 모두 만족해야 표시
    return matchesSearch && matchesPriority && matchesPeriod;
  });

  // 현재 정렬 방식 확인
  const sortType = sortToggleBtn.dataset.sort;

  // 제목을 기준으로 가나다순 또는 역순 정렬
  filteredTodos.sort(function (a, b) {
    if (sortType === "asc") {
      return a.title.localeCompare(b.title, "ko");
    }

    return b.title.localeCompare(a.title, "ko");
  });

  // 필터링과 정렬이 끝난 카드 화면에 표시
  filteredTodos.forEach(function (todo) {
    const cardHTML = createTodoCard(todo);

    if (todo.status === "todo") {
      todoList.insertAdjacentHTML("beforeend", cardHTML);
    } else if (todo.status === "doing") {
      doingList.insertAdjacentHTML("beforeend", cardHTML);
    } else if (todo.status === "done") {
      doneList.insertAdjacentHTML("beforeend", cardHTML);
    }
  });

  // 대시보드 숫자와 성취도 업데이트
  updateDashboard();

  updateAllCounts(); // 여기 새로 기입 ( 2026.07.13 카드 추가 시 카운트 ++)

  // 현재 적용 중인 필터 조건 표시
  if (filterStatusText) {
    const filterTexts = [];

    // 전체 기간이 아니면 표시
    if (currentPeriodFilter !== "all") {
      filterTexts.push(`기간: ${periodSelectedLabel.textContent.trim()}`);
    }

    // 전체 우선순위가 아니면 표시
    if (currentPriorityFilter !== "all") {
      filterTexts.push(`우선순위: ${prioritySelectedLabel.textContent.trim()}`);
    }

    // 적용된 조건이 있으면 박스로 표시
    if (filterTexts.length > 0) {
      filterStatusText.textContent = filterTexts.join(" · ");
      filterStatusText.style.display = "block";
    } else {
      filterStatusText.textContent = "";
      filterStatusText.style.display = "none";
    }
  }
}

// 할 일 데이터 1개를 카드 HTML로 만들어주는 함수
function createTodoCard(todo) {
  // 기본 우선순위 텍스트
  let priorityText = "중간";

  if (todo.priority === "high") {
    priorityText = "높음";
  } else if (todo.priority === "low") {
    priorityText = "낮음";
  }

  // 완료 상태이면 completed 클래스 추가
  const isCompletedClass = todo.status === "done" ? "completed" : "";

  // 카드 HTML 문자열 반환
  return `
  <article class="todo-card ${isCompletedClass}" data-id="${todo.id}">
  <div class="card-tag priority-${todo.priority}">
  ${priorityText}
</div>

<h3 class="card-title">${todo.title}</h3>

<p class="card-content">${todo.content || ""}</p>
    <div class="card-dates">
  <span class="date-item created">
    <i class="fa-solid fa-calendar"></i>
    ${formatDate(todo.createdAt)}
  </span>

  ${
    todo.doingAt
      ? `
        <span class="date-item doing-time">
          <i class="fa-solid fa-play"></i>
          ${formatDate(todo.doingAt)}
        </span>
      `
      : ""
  }

  ${
    todo.completedAt
      ? `
        <span class="date-item completed-time">
          <i class="fa-solid fa-check"></i>
          ${formatDate(todo.completedAt)}
        </span>
      `
      : ""
  }
</div>
    </article>
  `;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}. ${month}. ${day}. ${hour}:${minute}`;
}

// 검색창에 입력할 때마다 실행
if (searchInput) {
  searchInput.addEventListener("input", function () {
    // 입력한 검색어 저장
    currentSearchKeyword = searchInput.value.trim();

    if (currentSearchKeyword !== "") {
      // 입력한 검색어만 핑크색 영역에 넣기
      searchValue.textContent = `"${currentSearchKeyword}"`;

      // 검색어 배지 표시
      searchKeywordDisplay.style.display = "inline-block";
    } else {
      // 검색어를 지우면 배지 숨기기
      searchValue.textContent = "";
      searchKeywordDisplay.style.display = "none";
    }

    // 검색 조건으로 카드 다시 그리기
    renderTodos();
  });
}

// 처음 화면 표시
renderTodos();

// 버튼에 이벤트 연결

if (openModalBtn) {
  openModalBtn.addEventListener("click", openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

// 전체 데이터 초기화 버튼 클릭
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", function () {
    confirmTitle.textContent = "데이터 초기화";
    confirmMessage.innerHTML =
      "모든 할 일 데이터를 삭제하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.";

    confirmModal.classList.remove("hidden");
  });
}

// 취소 버튼 클릭
if (confirmCancelBtn) {
  confirmCancelBtn.addEventListener("click", function () {
    confirmModal.classList.add("hidden");
  });
}

// 삭제하기 버튼 클릭
if (confirmActionBtn) {
  confirmActionBtn.addEventListener("click", function () {
    todos.length = 0;
    renderTodos();
    confirmModal.classList.add("hidden");
  });
}

// 박스 칸 개수 추가 및 감소
function updateAllCounts() {
  //할 일 개수 세기
  const todoCount = document.querySelectorAll("#todo-list .todo-card").length;
  const doingCount = document.querySelectorAll("#doing-list .todo-card").length;
  const doneCount = document.querySelectorAll("#done-list .todo-card").length;

  const countTodoBadge = document.getElementById("count-todo");
  const countDoingBadge = document.getElementById("count-doing");
  const countDoneBadge = document.getElementById("count-done");

  if (countTodoBadge) countTodoBadge.textContent = todoCount;
  if (countDoingBadge) countDoingBadge.textContent = doingCount;
  if (countDoneBadge) countDoneBadge.textContent = doneCount;

  const todoEmpty = document.getElementById("todo-empty");
  if (todoEmpty) {
    todoEmpty.style.display = todoCount === 0 ? "block" : "none";
  }
}

// 보드 안 카드 클릭했을 때 열기
const kanbanBoard = document.getElementById("kanban-board");
if (kanbanBoard) {
  kanbanBoard.addEventListener("click", function (event) {
    const card = event.target.closest(".todo-card");

    if (!card) return; // 카드 빈 공간 누르면 중단

    const todoId = Number(card.dataset.id);

    const targetTodo = todos.find(function (t) {
      return t.id === todoId;
    });

    if (targetTodo) {
      // 일치하는 데이터 찾으면 모달창에 기존 데이터 넣기
      currentEditId = todoId;

      // 기존 모달창 입력값들 넣기
      todoTitleInput.value = targetTodo.title;
      todoContentInput.value = targetTodo.content;
      statusSelect.value = targetTodo.status;

      const priorityRadio = document.querySelector(
        `input[name="priority"][value="${targetTodo.priority}"]`,
      );
      if (priorityRadio) {
        priorityRadio.checked = true;
      }
      // 수정모드로 모달 창 띄우기
      openModal(true);
    }
  });
}
/* ==========================================================================
  [추가 작업] 다크모드 / 라이트모드 토글 제어 시스템
   ========================================================================== */
(function () {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const htmlElement = document.documentElement;

  // 브라우저 캐시(localStorage) 혹은 시스템 설정 확인 후 초기 테마 세팅
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  // 테마 변경 반영 및 저장 함수
  function applyTheme(theme) {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // 초기 로드 시 테마 적용
  applyTheme(initialTheme);

  // 테마 버튼 클릭 이벤트 연결
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });
  }
})();
