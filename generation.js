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

// 전체 할 일 데이터를 저장하는 배열
const todos = [];

let currentEditId = null;

// 현재 선택된 기간 필터
let currentPeriodFilter = "all";

// 현재 선택된 우선순위 필터
let currentPriorityFilter = "all";

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

  // 수정 모드 추가 (2026.07.13)
  if (currentEditId !== null) {
    const todoIndex = todos.findIndex(function (t) {
      return t.id === currentEditId;
    });

    if (todoIndex !== -1) {
      todos[todoIndex].title = titleValue;
      todos[todoIndex].content = contentValue;
      todos[todoIndex].priority = priorityValue;

      if (statusValue === "done" && todos[todoIndex].status !== "done") {
        todos[todoIndex].completedAt = now;
      } else if (statusValue !== "done") {
        todos[todoIndex].completedAt = null;
      }
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
      completedAt: statusValue === "done" ? now : null,
    };

    // 배열에 저장
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

    // 버튼 텍스트를 클릭한 항목으로 변경
    prioritySelectedLabel.textContent = item.textContent;

    // 선택 후 우선순위 메뉴 닫기
    dropdownPriority.classList.remove("open");
  });
});

// 화면 바깥 클릭 시 모든 드롭다운 닫기
document.addEventListener("click", function () {
  dropdownPeriod.classList.remove("open");
  dropdownPriority.classList.remove("open");
});

/// 정렬: 오름차순 / 내림차순 전환 ///

// 정렬 버튼 선택
const sortToggleBtn = document.getElementById("sort-toggle-btn");

// 정렬 버튼 클릭 시 오름차순/내림차순 텍스트 전환
sortToggleBtn.addEventListener("click", function () {
  if (sortToggleBtn.dataset.sort === "asc") {
    sortToggleBtn.dataset.sort = "desc";
    sortToggleBtn.textContent = "정렬: 내림차순 ↓";
  } else {
    sortToggleBtn.dataset.sort = "asc";
    sortToggleBtn.textContent = "정렬: 오름차순 ↑";
  }
  // 정렬 상태가 바뀐 뒤 화면을 다시 그린다.
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

// 여기서부터는 todos 대신 sortedTodos를 사용한다.
function renderTodos() {
  // 기존 화면 비우기
  todoList.innerHTML = "";
  doingList.innerHTML = "";
  doneList.innerHTML = "";

  const sortType = sortToggleBtn.dataset.sort;

  // todos 배열을 복사한 뒤, 제목 기준으로 정렬한다.
  const sortedTodos = [...todos].sort(function (a, b) {
    // 오름차순이면 제목을 가나다순으로 정렬한다.
    if (sortType === "asc") {
      return a.title.localeCompare(b.title, "ko");
    }

    // 내림차순이면 제목을 역순으로 정렬한다.
    else {
      return b.title.localeCompare(a.title, "ko");
    }
  });
  // 정렬된 todo들을 상태별 칸에 다시 넣는다.
  sortedTodos.forEach(function (todo) {
    const cardHTML = createTodoCard(todo);

    if (todo.status === "todo") {
      todoList.insertAdjacentHTML("beforeend", cardHTML);
    } else if (todo.status === "doing") {
      doingList.insertAdjacentHTML("beforeend", cardHTML);
    } else if (todo.status === "done") {
      doneList.insertAdjacentHTML("beforeend", cardHTML);
    }
  });

  // 여기 새로 기입 (2026.07.10) - 대시보드 카운트/성취도 업데이트
  updateDashboard();

  updateAllCounts(); // 여기 새로 기입 ( 2026.07.13 카드 추가 시 카운트 ++)
}

// 할 일 데이터 1개를 카드 HTML로 만들어주는 함수
function createTodoCard(todo) {
  // 기본 우선순위 텍스트는 중간
  let priorityText = "중간";

  // 우선순위 값에 따라 화면에 보여줄 한글 텍스트 설정
  if (todo.priority === "high") priorityText = "높음";
  if (todo.priority === "low") priorityText = "낮음";

  // 완료 상태이면 completed 클래스를 추가한다.
  const isCompletedClass = todo.status === "done" ? "completed" : "";

  // 카드 HTML 문자열을 만들어서 반환한다.
  return `
    <article class="todo-card ${isCompletedClass}" data-id="${todo.id}">
      <div class="card-tag priority-${todo.priority}">${priorityText}</div>
      <h3 class="card-title">${todo.title}</h3>
      <p class="card-content">${todo.content}</p>
      <div class="card-dates">
        <span class="date-item created">
          <i class="fa-solid fa-calendar"></i> ${formatDate(todo.createdAt)}
        </span>
        
        ${
          // 완료 시간이 있으면 완료 날짜도 표시한다.
          todo.completedAt
            ? `<span class="date-item completed-time">
                <i class="fa-solid fa-check"></i> ${formatDate(todo.completedAt)}
              </span>`
            : ""
        }
      </div>
    </article>
  `;
}

// timestamp 숫자를 화면에 보여줄 날짜 문자열로 바꾸는 함수
function formatDate(timestamp) {
  const date = new Date(timestamp);

  // 예: 2026. 07. 09. 11:23 형태로 변환
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}. ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
