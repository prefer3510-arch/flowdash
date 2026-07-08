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

// 모달 열기 / 닫기 함수 정의

function openModal() {
  todoModal.classList.remove("hidden");
}

function closeModal() {
  todoModal.classList.add("hidden");
  todoForm.reset();
}

// 버튼에 이벤트 연결

if (openModalBtn) {
  openModalBtn.addEventListener("click", openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

// 저장하기 버튼을 눌렀을 때 처리

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const titleValue = todoTitleInput.value.trim();
  const contentValue = todoContentInput.value.trim(); // ◀ 오타 수정 완료!

  const checkedPriority = document.querySelector(
    'input[name="priority"]:checked',
  );
  const priorityValue = checkedPriority ? checkedPriority.value : "mid";

  const statusValue = statusSelect.value;

  // 제목 없으면 제목 입력값 나오게 해다오
  if (titleValue === "") {
    alert("제목을 입력해주세요!");
    todoTitleInput.focus();
    return;
  }

  // 동적 카드 생성 후 알맞은 칸에 배치 코드

  // 현재 날짜와 시간 생성
  const now = new Date();
  const dateString = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, "0")}. ${String(now.getDate()).padStart(2, "0")}. ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // 화면 표시 텍스트 설정
  let priorityText = "중간";
  if (priorityValue === "high") priorityText = "높음";
  if (priorityValue === "low") priorityText = "낮음";

  // HTML 구조 가이드에 맞춤형으로 100% 매칭한 카드 HTML 문자열 템플릿
  const isCompletedClass = statusValue === "done" ? "completed" : "";

  const cardHTML = `
    <article class="todo-card ${isCompletedClass}" data-id="card-${Date.now()}">
      <div class="card-tag priority-${priorityValue}">${priorityText}</div>
      <h3 class="card-title">${titleValue}</h3>
      <p class="card-content">${contentValue}</p>
      <div class="card-dates">
        <span class="date-item created"><i class="icon-calendar"></i> ${dateString}</span>
        ${statusValue === "done" ? `<span class="date-item completed-time"><i class="icon-check"></i> ${dateString}</span>` : ""}
      </div>
    </article>
  `;

  // 어떤 구역에 배치할지 결정하고 주입하기

  if (statusValue === "todo") {
    // 만약 '할 일이 없습니다' 안내문구가 있다면 먼저 지우기
    const emptyState = document.getElementById("todo-empty");
    if (emptyState) {
      emptyState.remove();
    }
    todoList.insertAdjacentHTML("beforeend", cardHTML);
  } else if (statusValue === "doing") {
    doingList.insertAdjacentHTML("beforeend", cardHTML);
  } else if (statusValue === "done") {
    doneList.insertAdjacentHTML("beforeend", cardHTML);
  }

  closeModal();
});
