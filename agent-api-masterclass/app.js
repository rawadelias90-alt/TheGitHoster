// Apply saved appearance before the first paint. Storage may be disabled for local files.
try {
  const theme = localStorage.getItem('agentlab.theme');
  const lang = localStorage.getItem('agentlab.language');
  if (theme === 'light' || theme === 'dark') document.documentElement.className = theme;
  if (lang === 'en' || lang === 'ar') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
} catch (_) { /* Use the light, English defaults. */ }

// Internationalization Content Dictionary
        const i18n = {
            en: {
                title: "Agent API Masterclass",
                subtitle: "Interactive Codex Managed Harness Explorer",
                nav_modules: "Learning Modules",
                nav_builder: "Agent Builder",
                nav_simulator: "Session Simulator",
                nav_architecture: "Architecture Flow",
                nav_codestudio: "Code Studio",
                nav_quiz: "Mastery Quiz",
                curriculum: "Curriculum Index",
                sim_config_title: "Agent Session Builder",
                sim_config_desc: "Configure instructions, tools, environments and triggers",
                lbl_model: "Model Selection",
                lbl_instructions: "System Instructions",
                lbl_environment: "Execution Environment",
                lbl_tools: "Active Tools & Capabilities",
                lbl_prompt: "User Initial Input",
                btn_start_session: "Create Session & Start Turn",
                hdr_event_stream: "Live Events Stream",
                sim_idle_prompt: "Start the local training run to watch the simulated Agents SDK execution path.",
                action_req_title: "Action Required: tool approval interruption",
                btn_submit_result: "Submit Client Function Output",
                arch_title: "Agents SDK Architecture & Data Flow",
                arch_desc: "Interactive schematic showing state management, execution harness, sandboxes, MCP, and subagent delegation.",
                code_gen_title: "Code Generator",
                btn_copy_code: "Copy Code to Clipboard",
                quiz_title: "Agent API Mastery Challenge",
                quiz_subtitle: "Test your understanding of Agents SDK tools, approvals, orchestration, sessions and traces.",
                lang_btn: "العربية"
            },
            ar: {
                title: "واجهة برمجة الوكلاء Agent API",
                subtitle: "المستكشف التفاعلي لمحرك Codex للوكلاء المستقلين",
                nav_modules: "الوحدات التعليمية",
                nav_builder: "منشئ الوكيل",
                nav_simulator: "محاكي الجلسات",
                nav_architecture: "مخطط المعمارية",
                nav_codestudio: "أستوديو البرمجة",
                nav_quiz: "اختبار الإتقان",
                curriculum: "فهرس المنهج التعليمي",
                sim_config_title: "منشئ جلسة الوكيل",
                sim_config_desc: "قم بإعداد التعليمات، الأدوات، البيئة والمحفزات",
                lbl_model: "اختيار النموذج",
                lbl_instructions: "تعليمات النظام (Instructions)",
                lbl_environment: "بيئة التنفيذ (Environment)",
                lbl_tools: "الأدوات والقدرات المفعّلة",
                lbl_prompt: "مدخلات المستخدم الأولى",
                btn_start_session: "إنشاء الجلسة وبدء الدور",
                hdr_event_stream: "تدفق الأحداث المباشر",
                sim_idle_prompt: "انقر على 'إنشاء الجلسة وبدء الدور' لمشاهدة معالجة محرك Codex للأحداث فورياً.",
                action_req_title: "إجراء مطلوب: مقاطعة موافقة أداة",
                btn_submit_result: "إرسال مخرجات دالة العميل",
                arch_title: "معمارية وتدفق بيانات Agent API",
                arch_desc: "مخطط تفاعلي يوضح إدارة الحالة، البيئات المعزولة، بروتوكول MCP، وتفويض الوكلاء الفرعيين.",
                code_gen_title: "مولد الشفرات البرمجية",
                btn_copy_code: "نسخ الشفرة إلى الحافظة",
                quiz_title: "تحدي إتقان واجهة Agent API",
                quiz_subtitle: "اختبر فهمك لمحرك Codex والجلسات وتفويض الوكلاء الفرعيين.",
                lang_btn: "English"
            }
        };

        // Curriculum and knowledge checks are populated by the current educational-lab runtime below.
        const modulesData = [];
        const quizQuestions = [];

// Self-contained line icons. No external runtime or network requests are required.
const iconPaths = {
  'bot': '<path d="M12 3v3m-4 0h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z"/><path d="M2 11v5m20-5v5M9 11v2m6-2v2m-6 3h6"/>',
  'book-open': '<path d="M12 5.5C8.5 3.5 5.5 3.5 2 4.5V20c3.5-1 6.5-1 10 1m0-15.5c3.5-2 6.5-2 10-1V20c-3.5-1-6.5-1-10 1V5.5Z"/>',
  'play-circle': '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
  'network': '<rect x="8" y="3" width="8" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  'code': '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
  'trophy': '<path d="M8 3h8v7a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-4 2h8m-6-2h4"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  'moon': '<path d="M20.8 13.2A9 9 0 0 1 10.8 3.1 9.2 9.2 0 1 0 20.8 13.2Z"/>',
  'languages': '<path d="M3 5h12M9 3v2m4 0c-1 6-5 9-9 11m2-8c1 3 4 6 7 7m0 6 5-12 5 12m-8-4h6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
  'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  'layers': '<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  'sliders': '<path d="M4 4v6m0 4v6m8-16v10m0 4v2m8-16v2m0 4v10M1 10h6m2 8h6m2-12h6"/>',
  'play': '<path d="m7 4 14 8-14 8V4Z"/>',
  'terminal': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 8 4 4-4 4m7 0h3"/>',
  'alert-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'check': '<path d="m5 12 4 4L19 6"/>',
  'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  'file-code': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6m-10 4-3 3 3 3m4-6 3 3-3 3"/>',
  'copy': '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  'smartphone': '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  'cpu': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  'box': '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5m-9 5v9M7.5 5.5l9 5"/>',
  'pause-circle': '<circle cx="12" cy="12" r="9"/><path d="M10 9v6m4-6v6"/>',
  'eye': '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  'x': '<path d="m7 7 10 10M17 7 7 17"/>',
  'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  'database': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  'shield-check': '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>'
};
const lucide = {
  createIcons(root = document) {
    root.querySelectorAll('[data-lucide]').forEach(el => {
      const name = el.getAttribute('data-lucide');
      if (el.tagName.toLowerCase() === 'svg' && el.dataset.renderedIcon === name) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      for (const attribute of [...el.attributes]) svg.setAttribute(attribute.name, attribute.value);
      svg.setAttribute('class', [...new Set(['icon', ...(el.getAttribute('class') || '').split(/\s+/).filter(Boolean)])].join(' '));
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.65');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.dataset.renderedIcon = name;
      svg.innerHTML = iconPaths[name] || iconPaths.info;
      el.replaceWith(svg);
    });
  }
};

let currentLang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
let currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
let currentTab = 'modules';
let currentModuleIndex = 0;
let quizScore = 0;
// Presentation state survives language/theme changes; course and simulator data are unchanged.
const quizUiAnswers = new Map();
let toastTimeout;
const ui = {
  en: {
    skip: 'Skip to content', nav_learn: 'Learn', nav_simulate: 'Simulate', nav_flow: 'Flow',
    nav_code: 'Code', nav_quiz_short: 'Quiz', learning_space: 'YOUR LEARNING SPACE',
    course_hint: 'Choose a topic to explore.', previous: 'Previous', next: 'Next',
    interactive_sandbox: 'INTERACTIVE SANDBOX', local_simulation: 'Local simulation',
    clear: 'Clear', simulation_note: 'Simulated events only. No live API calls or external actions.',
    sdk_workspace: 'SDK WORKSPACE', code_examples: 'Code examples', target_language: 'Target Language / SDK',
    preset_scenario: 'Preset Scenario', score: 'Score', topics: 'topics', module: 'Module',
    light_mode: 'Light Mode', dark_mode: 'Dark Mode', switch_light: 'Switch to light mode',
    switch_dark: 'Switch to dark mode', switch_language: 'Switch to Arabic', primary_nav: 'Primary navigation',
    module_nav: 'Module navigation', events: 'Simulation events', generated_code: 'Generated code',
    copied: 'Code copied to clipboard!', copy_failed: 'Copy is unavailable. The code is selected for you to copy manually.'
  },
  ar: {
    skip: 'تخطي إلى المحتوى', nav_learn: 'تعلّم', nav_simulate: 'المحاكي', nav_flow: 'المخطط',
    nav_code: 'الشفرة', nav_quiz_short: 'الاختبار', learning_space: 'مساحتك التعليمية',
    course_hint: 'اختر موضوعاً لاستكشافه.', previous: 'السابق', next: 'التالي',
    interactive_sandbox: 'بيئة تفاعلية للتجربة', local_simulation: 'محاكاة محلية',
    clear: 'مسح', simulation_note: 'هذه أحداث محاكاة فقط، دون استدعاءات API فعلية أو إجراءات خارجية.',
    sdk_workspace: 'مساحة البرمجة', code_examples: 'أمثلة برمجية', target_language: 'اللغة / حزمة SDK',
    preset_scenario: 'السيناريو المسبق', score: 'النتيجة', topics: 'موضوعات', module: 'الوحدة',
    light_mode: 'الوضع الفاتح', dark_mode: 'الوضع الداكن', switch_light: 'التبديل إلى الوضع الفاتح',
    switch_dark: 'التبديل إلى الوضع الداكن', switch_language: 'Switch to English', primary_nav: 'التنقل الرئيسي',
    module_nav: 'التنقل بين الوحدات', events: 'أحداث المحاكاة', generated_code: 'الشفرة المولدة',
    copied: 'تم نسخ الشفرة البرمجية إلى الحافظة!', copy_failed: 'النسخ غير متاح. تم تحديد الشفرة لنسخها يدوياً.'
  }
};

const phase2Text = {
  en: {
    nav_build: 'Build', builder_eyebrow: 'AGENT WORKBENCH', builder_title: 'Agent Builder',
    builder_desc: 'Configure the core agent building blocks, then watch the blueprint update instantly across the training platform.',
    local_blueprint: 'Local blueprint', blueprint_map: 'BLUEPRINT MAP', blueprint_map_hint: 'Tap any block to edit that part of the agent.',
    part_agent: 'Agent', part_instructions: 'Instructions', part_model: 'Model', part_tools: 'Tools', part_guardrails: 'Guardrails', part_handoff: 'Handoff', part_session: 'Session', part_output: 'Output',
    identity_title: 'Agent identity & instructions', identity_desc: 'Give the agent a clear name and define what it should do.', agent_name: 'Agent name', agent_instructions: 'Instructions', instructions_help: 'Keep this focused on role, goals, boundaries and how the agent should respond.',
    model_title: 'Model', model_desc: 'Choose the model used by this training blueprint.', model_label: 'Model selection',
    tools_title: 'Tools', tools_desc: 'Select the capabilities available to the agent.', tool_web_desc: 'Hosted search capability', tool_mcp_desc: 'External tools exposed through MCP', tool_function_desc: 'Schema-defined application function', agent_as_tool: 'Agent as tool', tool_agent_desc: 'Manager-style specialist delegation',
    guardrails_title: 'Guardrails', guardrails_desc: 'Add checks around agent input and final output.', input_guardrail: 'Input guardrail', input_guardrail_desc: 'Validate the initial user input', output_guardrail: 'Output guardrail', output_guardrail_desc: 'Validate the final agent output',
    handoff_title: 'Handoffs', handoff_desc: 'Let this agent transfer the conversation to a specialist.', handoff_label: 'Specialist handoff', handoff_none: 'None', handoff_research: 'Research specialist', handoff_support: 'Support specialist',
    session_title: 'Session memory', session_desc: 'Keep working context available across turns in the training run.', persistent_session: 'Persistent session', persistent_session_desc: 'Retain working context between turns',
    output_title: 'Output', output_desc: 'Choose how the final response should be shaped.', output_label: 'Output type', output_text: 'Text', output_structured: 'Structured output',
    builder_note: 'This builder is a local training surface. It teaches the main SDK concepts but does not create, deploy or call a live OpenAI agent.',
    blueprint: 'AGENT BLUEPRINT', blueprint_title: 'Your working agent', saved_local: 'Saved locally', coverage: 'Blueprint coverage', edit_builder: 'Edit in Builder', reset_blueprint: 'Reset blueprint',
    configured: 'Configured', optional: 'Optional', missing: 'Missing', on: 'On', off: 'Off', none: 'None', text: 'Text', structured: 'Structured', instructions_ready: 'Ready',
    reset_confirm: 'Reset the Agent Blueprint to the starter configuration?', reset_done: 'Agent Blueprint reset.', blueprint_saved: 'Blueprint saved locally.'
  },
  ar: {
    nav_build: 'البناء', builder_eyebrow: 'مساحة بناء الوكيل', builder_title: 'منشئ الوكيل',
    builder_desc: 'اضبط المكونات الأساسية للوكيل وشاهد المخطط يتحدث فوراً في جميع أقسام منصة التدريب.',
    local_blueprint: 'مخطط محلي', blueprint_map: 'مخطط الوكيل', blueprint_map_hint: 'اضغط على أي جزء للانتقال إلى إعداداته.',
    part_agent: 'الوكيل', part_instructions: 'التعليمات', part_model: 'النموذج', part_tools: 'الأدوات', part_guardrails: 'ضوابط الحماية', part_handoff: 'التسليم', part_session: 'الجلسة', part_output: 'المخرجات',
    identity_title: 'هوية الوكيل وتعليماته', identity_desc: 'امنح الوكيل اسماً واضحاً وحدد ما المطلوب منه.', agent_name: 'اسم الوكيل', agent_instructions: 'التعليمات', instructions_help: 'ركز على الدور والأهداف والحدود وطريقة استجابة الوكيل.',
    model_title: 'النموذج', model_desc: 'اختر النموذج المستخدم في مخطط التدريب.', model_label: 'اختيار النموذج',
    tools_title: 'الأدوات', tools_desc: 'حدد القدرات المتاحة للوكيل.', tool_web_desc: 'إمكانية البحث المستضاف', tool_mcp_desc: 'أدوات خارجية عبر MCP', tool_function_desc: 'دالة تطبيق محددة بالمخطط', agent_as_tool: 'وكيل كأداة', tool_agent_desc: 'تفويض متخصص بنمط المدير',
    guardrails_title: 'ضوابط الحماية', guardrails_desc: 'أضف فحوصات على مدخلات الوكيل ومخرجاته النهائية.', input_guardrail: 'ضابط المدخلات', input_guardrail_desc: 'فحص أول مدخل للمستخدم', output_guardrail: 'ضابط المخرجات', output_guardrail_desc: 'فحص المخرج النهائي للوكيل',
    handoff_title: 'التسليم للوكلاء', handoff_desc: 'اسمح للوكيل بتحويل المحادثة إلى وكيل متخصص.', handoff_label: 'الوكيل المتخصص', handoff_none: 'بدون', handoff_research: 'متخصص أبحاث', handoff_support: 'متخصص دعم',
    session_title: 'ذاكرة الجلسة', session_desc: 'احتفظ بسياق العمل عبر الأدوار ضمن تجربة التدريب.', persistent_session: 'جلسة مستمرة', persistent_session_desc: 'الاحتفاظ بسياق العمل بين الأدوار',
    output_title: 'المخرجات', output_desc: 'حدد شكل الاستجابة النهائية.', output_label: 'نوع المخرجات', output_text: 'نص', output_structured: 'مخرجات منظمة',
    builder_note: 'هذا المنشئ مخصص للتدريب المحلي. يشرح مفاهيم SDK الأساسية لكنه لا ينشئ أو ينشر أو يستدعي وكيلاً فعلياً لدى OpenAI.',
    blueprint: 'مخطط الوكيل', blueprint_title: 'الوكيل الذي تعمل عليه', saved_local: 'محفوظ محلياً', coverage: 'اكتمال المخطط', edit_builder: 'تعديل في المنشئ', reset_blueprint: 'إعادة ضبط المخطط',
    configured: 'معدّ', optional: 'اختياري', missing: 'ناقص', on: 'مفعّل', off: 'متوقف', none: 'بدون', text: 'نص', structured: 'منظم', instructions_ready: 'جاهزة',
    reset_confirm: 'هل تريد إعادة مخطط الوكيل إلى الإعداد الابتدائي؟', reset_done: 'تمت إعادة ضبط مخطط الوكيل.', blueprint_saved: 'تم حفظ المخطط محلياً.'
  }
};
const phase3Text = {
  en: {
    simulator_desc: 'Watch a training run unfold step by step, pause for human approval, then inspect the technical event payloads underneath.',
    run_overview: 'TRAINING RUN', live_execution: 'LIVE EXECUTION', timeline_title: 'Execution timeline',
    timeline_empty: 'Start a simulation to watch the user request, agent work, tools, approvals and final response unfold in order.',
    approval_eyebrow: 'HUMAN APPROVAL', approval_title: 'Run paused for approval', approval_desc: 'The agent wants to call a tool that requires human approval. Review the request before the run continues.',
    requested_tool: 'Requested tool', calling_agent: 'Calling agent', call_id: 'Call ID', view_arguments: 'View arguments', hide_arguments: 'Hide arguments',
    approval_hint: 'Training model: the Agents SDK surfaces an interruption, the result can be converted to RunState, and the same run resumes after approve or reject.',
    reject: 'Reject', approve: 'Approve', technical_details: 'Technical details', technical_empty: 'Run the simulation to populate the event stream.', selected_event: 'Selected event', inspect_payload: 'Select a timeline step or event to inspect its payload.',
    status_idle: 'Ready', status_running: 'Running', status_waiting: 'Waiting for approval', status_completed: 'Completed', status_rejected: 'Completed with rejection',
    steps: 'steps', events: 'events', step_complete: 'Complete', step_waiting: 'Waiting', step_approved: 'Approved', step_rejected: 'Rejected',
    user_request: 'User request', user_request_desc: 'The run received the user task and created the working turn.',
    agent_started: 'Agent started', agent_started_desc: 'The configured agent began reasoning over the request and available capabilities.',
    input_guardrail: 'Input guardrail', input_guardrail_desc: 'The request passed the configured input validation check.',
    web_search: 'Web search', web_search_desc: 'The agent queried current public information through the web search tool.',
    mcp_call: 'MCP tool call', mcp_call_desc: 'The agent requested supporting documentation from the configured MCP server.',
    specialist: 'Specialist delegation', specialist_desc: 'A specialist agent handled the release-note comparison as a delegated subtask.',
    function_request: 'Tool approval required', function_request_desc: 'query_customer_db is marked as requiring human approval before execution.',
    function_approved: 'Tool approved', function_approved_desc: 'The reviewer approved this call, so the run can resume and execute the tool.',
    function_rejected: 'Tool rejected', function_rejected_desc: 'The reviewer rejected the call. The run resumes without executing the tool.',
    function_result: 'Function tool completed', function_result_desc: 'The approved customer lookup returned a simulated result to the agent.',
    output_guardrail: 'Output guardrail', output_guardrail_desc: 'The draft response passed the configured output validation check.',
    final_response: 'Final response', final_response_desc: 'The agent completed the run using the available tool and specialist results.',
    final_response_rejected_desc: 'The agent completed with partial information because the customer database tool was rejected.',
    runstate_event: 'approval.interruption', approved_event: 'approval.approved', rejected_event: 'approval.rejected'
  },
  ar: {
    simulator_desc: 'شاهد سير تجربة التدريب خطوة بخطوة، وتوقفها عند الحاجة إلى موافقة بشرية، ثم افحص التفاصيل التقنية للأحداث.',
    run_overview: 'تجربة التدريب', live_execution: 'التنفيذ المباشر', timeline_title: 'المسار الزمني للتنفيذ',
    timeline_empty: 'ابدأ المحاكاة لمشاهدة طلب المستخدم وعمل الوكيل والأدوات والموافقات والاستجابة النهائية بالترتيب.',
    approval_eyebrow: 'موافقة بشرية', approval_title: 'تم إيقاف التشغيل بانتظار الموافقة', approval_desc: 'يريد الوكيل استدعاء أداة تتطلب موافقة بشرية. راجع الطلب قبل متابعة التشغيل.',
    requested_tool: 'الأداة المطلوبة', calling_agent: 'الوكيل المستدعي', call_id: 'معرّف الاستدعاء', view_arguments: 'عرض المدخلات', hide_arguments: 'إخفاء المدخلات',
    approval_hint: 'نموذج التدريب: تعرض Agents SDK مقاطعة للتشغيل، ويمكن تحويل النتيجة إلى RunState ثم استئناف التشغيل نفسه بعد الموافقة أو الرفض.',
    reject: 'رفض', approve: 'موافقة', technical_details: 'التفاصيل التقنية', technical_empty: 'شغّل المحاكاة لإظهار تدفق الأحداث.', selected_event: 'الحدث المحدد', inspect_payload: 'اختر خطوة أو حدثاً لفحص بياناته التقنية.',
    status_idle: 'جاهز', status_running: 'قيد التشغيل', status_waiting: 'بانتظار الموافقة', status_completed: 'مكتمل', status_rejected: 'مكتمل مع رفض',
    steps: 'خطوات', events: 'أحداث', step_complete: 'مكتمل', step_waiting: 'بانتظار', step_approved: 'تمت الموافقة', step_rejected: 'مرفوض',
    user_request: 'طلب المستخدم', user_request_desc: 'استلم التشغيل مهمة المستخدم وأنشأ دور العمل.',
    agent_started: 'بدأ الوكيل', agent_started_desc: 'بدأ الوكيل المعدّ العمل على الطلب والقدرات المتاحة له.',
    input_guardrail: 'ضابط المدخلات', input_guardrail_desc: 'اجتاز الطلب فحص المدخلات المعدّ مسبقاً.',
    web_search: 'بحث الويب', web_search_desc: 'استخدم الوكيل أداة بحث الويب للحصول على معلومات عامة حديثة.',
    mcp_call: 'استدعاء أداة MCP', mcp_call_desc: 'طلب الوكيل معلومات داعمة من خادم MCP المعدّ.',
    specialist: 'تفويض لوكيل متخصص', specialist_desc: 'تولى وكيل متخصص مقارنة ملاحظات الإصدار كمهمة فرعية.',
    function_request: 'الأداة تحتاج موافقة', function_request_desc: 'تم إعداد query_customer_db لتتطلب موافقة بشرية قبل التنفيذ.',
    function_approved: 'تمت الموافقة على الأداة', function_approved_desc: 'وافق المراجع على الاستدعاء، لذلك يمكن استئناف التشغيل وتنفيذ الأداة.',
    function_rejected: 'تم رفض الأداة', function_rejected_desc: 'رفض المراجع الاستدعاء. يستأنف التشغيل دون تنفيذ الأداة.',
    function_result: 'اكتمل تنفيذ الدالة', function_result_desc: 'أعاد استعلام العميل الموافق عليه نتيجة محاكاة إلى الوكيل.',
    output_guardrail: 'ضابط المخرجات', output_guardrail_desc: 'اجتازت مسودة الاستجابة فحص المخرجات المعدّ.',
    final_response: 'الاستجابة النهائية', final_response_desc: 'أكمل الوكيل التشغيل باستخدام نتائج الأدوات والوكيل المتخصص المتاحة.',
    final_response_rejected_desc: 'أكمل الوكيل التشغيل بمعلومات جزئية لأن استدعاء قاعدة بيانات العملاء تم رفضه.',
    runstate_event: 'approval.interruption', approved_event: 'approval.approved', rejected_event: 'approval.rejected'
  }
 };
const phase45Text = {
  en: {
    nav_trace:'Trace', nav_design:'Design', trace_eyebrow:'RUN DIAGNOSTICS', trace_title:'Trace Inspector', trace_desc:'Inspect the latest training run as a hierarchy of agent, tool, handoff, guardrail and approval spans.', trace_latest:'Latest local run', open_simulator:'Open simulator', total_spans:'Total spans', tool_spans:'Tool spans', handoff_spans:'Handoffs', guardrail_spans:'Guardrails', run_context:'RUN CONTEXT', search_trace:'Search trace', search_trace_placeholder:'Search spans', filter_kind:'Filter by span type', filter_all:'All spans', filter_agent:'Agent', filter_tool:'Tools', filter_handoff:'Handoffs', filter_guardrail:'Guardrails', filter_approval:'Approvals', span_tree:'SPAN TREE', trace_sequence:'Execution sequence', span_details:'SPAN DETAILS', span_id:'Span ID', parent_span:'Parent', span_status:'Status', duration:'Duration', span_payload:'Span payload', trace_empty:'Run a simulation first. The latest local run will appear here automatically.', trace_note:'Training trace only. Span hierarchy and durations are simulated from the local run to teach inspection patterns.', no_trace_match:'No spans match the current filters.', root:'root',
    design_eyebrow:'SYSTEM DESIGN LAB', design_title:'Orchestration & Guardrail Lab', design_desc:'Compare orchestration patterns, visualize agent relationships, and test where guardrails stop or allow a run.', sync_blueprint:'Use current blueprint', orchestration_eyebrow:'ORCHESTRATION DESIGNER', orchestration_title:'Choose an agent pattern', orchestration_desc:'Switch patterns to see how control, delegation, handoffs and approvals change the flow.', pattern_single:'Single agent', pattern_manager:'Manager + agents as tools', pattern_handoff:'Handoff', pattern_parallel:'Parallel specialists', pattern_approval:'Human approval', how_it_works:'HOW IT WORKS', blueprint_fit:'Blueprint fit', fit_recommended:'Recommended for the current blueprint', fit_available:'Available training pattern', fit_synced:'Pattern synced from blueprint',
    single_desc:'One agent owns the request, calls its tools directly, and returns the response. Best for focused workflows with limited delegation.', manager_desc:'A manager keeps control and invokes specialist agents as tools. The manager owns synthesis and the final response.', handoff_desc2:'A triage agent transfers control to a specialist. The specialist becomes responsible for the conversation from that point.', parallel_desc:'A coordinator dispatches independent specialist work in parallel, then combines the results in a synthesis step.', approval_desc2:'The agent reaches a sensitive tool call, pauses for a human decision, and resumes the same run after approval or rejection.',
    guardrail_eyebrow:'GUARDRAIL VISUALIZER', guardrail_title:'Test the control path', guardrail_desc:'Run safe and blocked scenarios to see which stage stops the workflow.', scenario:'Scenario', scenario_safe:'Safe request', scenario_input:'Input blocked', scenario_tool:'Tool blocked', scenario_output:'Output blocked', run_guardrail:'Run scenario', guardrail_idle:'Choose a scenario and run it to visualize the control path.', passed:'Passed', blocked:'Blocked', skipped:'Not configured', guardrail_configured:'configured', stage_user:'User input', stage_input:'Input guardrail', stage_agent:'Agent', stage_tool:'Tool guardrail', stage_output:'Output guardrail', stage_response:'Response', stage_processed:'Processed', stage_allowed:'Allowed', stage_not_run:'Not reached', stage_not_configured:'Not configured', safe_result:'The request passed the active checks and reached the response stage.', input_block_result:'The input guardrail stopped the run before the agent executed.', tool_block_result:'The tool guardrail stopped the tool call before a result was returned.', output_block_result:'The output guardrail blocked the draft before it reached the user.', scenario_demo_note:'Scenario mode demonstrates the selected guardrail even when it is not enabled in the current blueprint.', reference_flow:'SDK architecture reference', reference_hint:'Open the original architecture diagram',
    kind_agent:'Agent', kind_tool:'Tool', kind_handoff:'Handoff', kind_guardrail:'Guardrail', kind_approval:'Approval', kind_user:'Input', kind_final:'Output', status_complete:'Complete', status_waiting:'Waiting', status_approved:'Approved', status_rejected:'Rejected'
  },
  ar: {
    nav_trace:'التتبع', nav_design:'التصميم', trace_eyebrow:'تشخيص التشغيل', trace_title:'فاحص التتبع', trace_desc:'افحص آخر تجربة تدريب كسلسلة مترابطة من الوكيل والأدوات والتسليمات وضوابط الحماية والموافقات.', trace_latest:'آخر تشغيل محلي', open_simulator:'فتح المحاكي', total_spans:'إجمالي المقاطع', tool_spans:'مقاطع الأدوات', handoff_spans:'التسليمات', guardrail_spans:'ضوابط الحماية', run_context:'سياق التشغيل', search_trace:'البحث في التتبع', search_trace_placeholder:'ابحث في المقاطع', filter_kind:'تصفية حسب النوع', filter_all:'كل المقاطع', filter_agent:'الوكيل', filter_tool:'الأدوات', filter_handoff:'التسليمات', filter_guardrail:'ضوابط الحماية', filter_approval:'الموافقات', span_tree:'شجرة المقاطع', trace_sequence:'تسلسل التنفيذ', span_details:'تفاصيل المقطع', span_id:'معرّف المقطع', parent_span:'الأصل', span_status:'الحالة', duration:'المدة', span_payload:'بيانات المقطع', trace_empty:'شغّل المحاكاة أولاً. سيظهر آخر تشغيل محلي هنا تلقائياً.', trace_note:'هذا تتبع تدريبي فقط. يتم محاكاة التسلسل والمدد من التشغيل المحلي لتعليم أنماط الفحص.', no_trace_match:'لا توجد مقاطع تطابق عوامل التصفية.', root:'الجذر',
    design_eyebrow:'مختبر تصميم النظام', design_title:'مختبر التنسيق وضوابط الحماية', design_desc:'قارن أنماط التنسيق، وشاهد علاقات الوكلاء، واختبر أين تسمح ضوابط الحماية بالتشغيل أو توقفه.', sync_blueprint:'استخدام المخطط الحالي', orchestration_eyebrow:'مصمم التنسيق', orchestration_title:'اختر نمط الوكلاء', orchestration_desc:'بدّل بين الأنماط لمشاهدة اختلاف التحكم والتفويض والتسليم والموافقات.', pattern_single:'وكيل واحد', pattern_manager:'مدير + وكلاء كأدوات', pattern_handoff:'تسليم', pattern_parallel:'متخصصون بالتوازي', pattern_approval:'موافقة بشرية', how_it_works:'كيف يعمل', blueprint_fit:'ملاءمة المخطط', fit_recommended:'موصى به للمخطط الحالي', fit_available:'نمط تدريبي متاح', fit_synced:'تمت المزامنة من المخطط',
    single_desc:'وكيل واحد يملك الطلب ويستدعي أدواته مباشرة ثم يعيد الاستجابة. مناسب لسير عمل مركز مع تفويض محدود.', manager_desc:'يحتفظ وكيل مدير بالتحكم ويستدعي الوكلاء المتخصصين كأدوات، ثم يتولى الدمج والاستجابة النهائية.', handoff_desc2:'يقوم وكيل الفرز بتسليم التحكم إلى متخصص، ويصبح المتخصص مسؤولاً عن المحادثة من تلك النقطة.', parallel_desc:'يوزع المنسق أعمالاً مستقلة على عدة متخصصين بالتوازي ثم يجمع النتائج في خطوة دمج.', approval_desc2:'يصل الوكيل إلى استدعاء أداة حساسة، فيتوقف بانتظار قرار بشري ثم يستأنف التشغيل نفسه بعد الموافقة أو الرفض.',
    guardrail_eyebrow:'مصور ضوابط الحماية', guardrail_title:'اختبر مسار التحكم', guardrail_desc:'شغّل سيناريوهات آمنة ومحجوبة لترى في أي مرحلة يتوقف سير العمل.', scenario:'السيناريو', scenario_safe:'طلب آمن', scenario_input:'حظر المدخلات', scenario_tool:'حظر الأداة', scenario_output:'حظر المخرجات', run_guardrail:'تشغيل السيناريو', guardrail_idle:'اختر سيناريو وشغله لعرض مسار التحكم.', passed:'اجتاز', blocked:'محجوب', skipped:'غير معدّ', guardrail_configured:'معدّ', stage_user:'مدخل المستخدم', stage_input:'ضابط المدخلات', stage_agent:'الوكيل', stage_tool:'ضابط الأداة', stage_output:'ضابط المخرجات', stage_response:'الاستجابة', stage_processed:'تمت المعالجة', stage_allowed:'مسموح', stage_not_run:'لم يتم الوصول', stage_not_configured:'غير معدّ', safe_result:'اجتاز الطلب الفحوصات النشطة ووصل إلى مرحلة الاستجابة.', input_block_result:'أوقف ضابط المدخلات التشغيل قبل تنفيذ الوكيل.', tool_block_result:'أوقف ضابط الأداة الاستدعاء قبل إعادة النتيجة.', output_block_result:'حجب ضابط المخرجات المسودة قبل وصولها إلى المستخدم.', scenario_demo_note:'وضع السيناريو يعرض الضابط المحدد للتدريب حتى إن لم يكن مفعلاً في المخطط الحالي.', reference_flow:'مرجع معمارية SDK', reference_hint:'افتح مخطط المعمارية الأصلي',
    kind_agent:'وكيل', kind_tool:'أداة', kind_handoff:'تسليم', kind_guardrail:'ضابط', kind_approval:'موافقة', kind_user:'مدخل', kind_final:'مخرج', status_complete:'مكتمل', status_waiting:'بانتظار', status_approved:'موافق عليه', status_rejected:'مرفوض'
  }
};
function translatePhase45() {
  const t = phase45Text[currentLang];
  document.querySelectorAll('[data-p45]').forEach(el => { const value = t[el.dataset.p45]; if (value !== undefined) el.textContent = value; });
  document.querySelectorAll('[data-p45-placeholder]').forEach(el => { const value = t[el.dataset.p45Placeholder]; if (value !== undefined) el.placeholder = value; });
  const traceList = document.getElementById('trace-span-list'); if (traceList) traceList.setAttribute('aria-label', t.trace_sequence);
  const canvas = document.getElementById('orchestration-canvas'); if (canvas) canvas.setAttribute('aria-label', t.orchestration_title);
  const pipeline = document.getElementById('guardrail-pipeline'); if (pipeline) pipeline.setAttribute('aria-label', t.guardrail_title);
  renderTraceInspector(); renderOrchestrationCanvas(); renderGuardrailPipeline(); updateDesignBlueprintState();
}
function translatePhase3() {
  document.querySelectorAll('[data-p3]').forEach(el => {
    const value = phase3Text[currentLang][el.dataset.p3];
    if (value !== undefined) el.textContent = value;
  });
  const timeline = document.getElementById('simulation-timeline');
  if (timeline) timeline.setAttribute('aria-label', phase3Text[currentLang].timeline_title);
  const argumentsButton = document.getElementById('approval-arguments-toggle');
  if (argumentsButton) {
    const key = argumentsButton.getAttribute('aria-expanded') === 'true' ? 'hide_arguments' : 'view_arguments';
    const label = argumentsButton.querySelector('[data-p3]');
    if (label) { label.dataset.p3 = key; label.textContent = phase3Text[currentLang][key]; }
  }
  renderSimulationLanguage();
}

function translatePhase2() {
  document.querySelectorAll('[data-p2]').forEach(el => {
    const value = phase2Text[currentLang][el.dataset.p2];
    if (value !== undefined) el.textContent = value;
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}
function savePreference(key, value) {
  try { localStorage.setItem(`agentlab.${key}`, value); } catch (_) { /* Preferences remain valid for this page session. */ }
}
function motionBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

const phase67Text = {
  en: {
    nav_challenge:'Challenge', challenge_eyebrow:'GUIDED PRACTICE', challenge_title:'Missions & Mastery', challenge_desc:'Complete practical missions across Builder, Simulator, Trace, Design and Code Studio. Progress is saved locally.', mastery_level:'Mastery level', mastery_progress:'MASTERY PROGRESSION', keep_building:'Build, run, inspect and prove it', level_explorer:'Explorer', level_builder:'Builder', level_operator:'Operator', level_master:'Master', knowledge_check:'KNOWLEDGE CHECK',
    mission_complete:'Completed', mission_continue:'Continue', mission_start:'Start mission', mission_review:'Review', mission_1_title:'Define the agent', mission_1_desc:'Give the Blueprint a clear agent name and working instructions.', mission_2_title:'Attach a capability', mission_2_desc:'Enable at least one tool so the agent can act beyond text generation.', mission_3_title:'Add a guardrail', mission_3_desc:'Configure an input or output guardrail in the visual Builder.', mission_4_title:'Choose orchestration', mission_4_desc:'Configure a specialist handoff or an agent-as-tool delegation pattern.', mission_5_title:'Run the agent', mission_5_desc:'Complete one simulation from user request through final response.', mission_6_title:'Make an approval decision', mission_6_desc:'Approve or reject a human-in-the-loop tool request during simulation.', mission_7_title:'Inspect a trace span', mission_7_desc:'Open Trace and inspect an execution span from a completed training run.', mission_8_title:'Generate synced code', mission_8_desc:'Open Code Studio and generate code directly from the current Blueprint.', mission_9_title:'Pass the knowledge check', mission_9_desc:'Answer all mastery quiz questions correctly.',
    sdk_workspace:'BLUEPRINT CODE WORKSPACE', code_desc:'Generated code stays synchronized with the Agent Blueprint. Apply a preset here to push a configuration back into the visual Builder.', synced_blueprint:'Synced to Blueprint', code_controls:'Code controls', builder_preset:'Builder preset', preset_current:'Current Blueprint', preset_quickstart:'Quickstart agent', preset_mcp:'MCP tools', preset_multiagent:'Multi-agent coordinator', preset_approval:'Human approval workflow', apply_preset:'Apply preset to Builder', open_builder:'Open visual Builder', generated_from_blueprint:'Generated from Blueprint', code_full:'Full agent', code_agent:'Agent', code_tools:'Tools', code_guardrails:'Guardrails', code_runtime:'Runtime', code_json:'Blueprint JSON', live_sync_hint:'Builder edits update this code immediately.', preset_applied:'Preset applied to the Agent Blueprint.'
  },
  ar: {
    nav_challenge:'التحدي', challenge_eyebrow:'تدريب عملي موجّه', challenge_title:'المهمات ومستوى الإتقان', challenge_desc:'أكمل مهمات عملية عبر المنشئ والمحاكي والتتبع والتصميم واستوديو الكود. يتم حفظ التقدم محلياً.', mastery_level:'مستوى الإتقان', mastery_progress:'تطور الإتقان', keep_building:'ابنِ وشغّل وافحص وأثبت فهمك', level_explorer:'مستكشف', level_builder:'منشئ', level_operator:'مشغّل', level_master:'متقن', knowledge_check:'اختبار المعرفة',
    mission_complete:'مكتملة', mission_continue:'متابعة', mission_start:'ابدأ المهمة', mission_review:'مراجعة', mission_1_title:'عرّف الوكيل', mission_1_desc:'امنح المخطط اسم وكيل واضحاً وتعليمات عمل محددة.', mission_2_title:'أضف قدرة', mission_2_desc:'فعّل أداة واحدة على الأقل حتى يستطيع الوكيل تنفيذ مهام تتجاوز توليد النص.', mission_3_title:'أضف ضابط حماية', mission_3_desc:'فعّل ضابطاً للمدخلات أو المخرجات من المنشئ البصري.', mission_4_title:'اختر نمط التنسيق', mission_4_desc:'اضبط تسليماً لوكيل متخصص أو استخدم وكيلاً كأداة.', mission_5_title:'شغّل الوكيل', mission_5_desc:'أكمل محاكاة واحدة من طلب المستخدم حتى الاستجابة النهائية.', mission_6_title:'اتخذ قرار موافقة', mission_6_desc:'وافق أو ارفض طلب أداة يتطلب تدخلاً بشرياً أثناء المحاكاة.', mission_7_title:'افحص مقطع تتبع', mission_7_desc:'افتح التتبع وافحص مقطع تنفيذ من تشغيل تدريبي مكتمل.', mission_8_title:'ولّد كوداً متزامناً', mission_8_desc:'افتح استوديو الكود وولّد الكود مباشرة من مخطط الوكيل الحالي.', mission_9_title:'اجتز اختبار المعرفة', mission_9_desc:'أجب بشكل صحيح عن جميع أسئلة اختبار الإتقان.',
    sdk_workspace:'مساحة كود المخطط', code_desc:'يبقى الكود متزامناً مع مخطط الوكيل. يمكنك تطبيق إعداد جاهز من هنا وإرساله إلى المنشئ البصري.', synced_blueprint:'متزامن مع المخطط', code_controls:'إعدادات الكود', builder_preset:'إعداد جاهز للمنشئ', preset_current:'المخطط الحالي', preset_quickstart:'وكيل بداية سريعة', preset_mcp:'أدوات MCP', preset_multiagent:'منسق متعدد الوكلاء', preset_approval:'تدفق موافقة بشرية', apply_preset:'تطبيق الإعداد على المنشئ', open_builder:'فتح المنشئ البصري', generated_from_blueprint:'مولّد من المخطط', code_full:'الوكيل الكامل', code_agent:'الوكيل', code_tools:'الأدوات', code_guardrails:'ضوابط الحماية', code_runtime:'التشغيل', code_json:'JSON للمخطط', live_sync_hint:'تعديلات المنشئ تحدّث هذا الكود فوراً.', preset_applied:'تم تطبيق الإعداد على مخطط الوكيل.'
  }
};
function translatePhase67() {
  const t=phase67Text[currentLang];
  document.querySelectorAll('[data-p67]').forEach(el=>{ const value=t[el.dataset.p67]; if(value!==undefined) el.textContent=value; });
  renderMissions();
  renderMasteryProgress();
  updateCodeSummary();
  generateCode();
}

const DEFAULT_BLUEPRINT = Object.freeze({
  name: 'Research Agent',
  instructions: 'Use web search, docs MCP, and execute functions to fulfill requests. Delegate sub-tasks when complex.',
  model: 'gpt-6-astra',
  tools: ['web_search', 'mcp', 'function'],
  guardrails: [],
  handoff: 'none',
  session: true,
  output: 'text'
});
function sanitizeBlueprint(value) {
  const source = value && typeof value === 'object' ? value : {};
  const allowedTools = new Set(['web_search', 'mcp', 'function', 'agent_tool']);
  const allowedGuardrails = new Set(['input', 'output']);
  return {
    name: typeof source.name === 'string' ? source.name.slice(0, 80) : DEFAULT_BLUEPRINT.name,
    instructions: typeof source.instructions === 'string' ? source.instructions.slice(0, 4000) : DEFAULT_BLUEPRINT.instructions,
    model: ['gpt-6-astra', 'gpt-5.6-terra', 'gpt-5.6-luna'].includes(source.model) ? source.model : DEFAULT_BLUEPRINT.model,
    tools: Array.isArray(source.tools) ? [...new Set(source.tools.filter(item => allowedTools.has(item)))] : [...DEFAULT_BLUEPRINT.tools],
    guardrails: Array.isArray(source.guardrails) ? [...new Set(source.guardrails.filter(item => allowedGuardrails.has(item)))] : [...DEFAULT_BLUEPRINT.guardrails],
    handoff: ['none', 'research', 'support'].includes(source.handoff) ? source.handoff : DEFAULT_BLUEPRINT.handoff,
    session: typeof source.session === 'boolean' ? source.session : DEFAULT_BLUEPRINT.session,
    output: ['text', 'structured'].includes(source.output) ? source.output : DEFAULT_BLUEPRINT.output
  };
}
function loadBlueprint() {
  try {
    const stored = localStorage.getItem('agentlab.blueprint');
    return stored ? sanitizeBlueprint(JSON.parse(stored)) : sanitizeBlueprint(DEFAULT_BLUEPRINT);
  } catch (_) {
    return sanitizeBlueprint(DEFAULT_BLUEPRINT);
  }
}
let agentBlueprint = loadBlueprint();
function saveBlueprint() {
  try { localStorage.setItem('agentlab.blueprint', JSON.stringify(agentBlueprint)); } catch (_) { /* Keep the in-page blueprint if storage is unavailable. */ }
}
function getBlueprintPartStates() {
  return {
    agent: agentBlueprint.name.trim() ? 'configured' : 'missing',
    instructions: agentBlueprint.instructions.trim() ? 'configured' : 'missing',
    model: agentBlueprint.model ? 'configured' : 'missing',
    tools: agentBlueprint.tools.length ? 'configured' : 'missing',
    guardrails: agentBlueprint.guardrails.length ? 'configured' : 'optional',
    handoff: agentBlueprint.handoff !== 'none' ? 'configured' : 'optional',
    session: agentBlueprint.session ? 'configured' : 'optional',
    output: agentBlueprint.output ? 'configured' : 'missing'
  };
}
function getBlueprintCoverage() {
  const states = getBlueprintPartStates();
  return Object.values(states).filter(state => state === 'configured').length;
}
function hydrateBuilder() {
  const name = document.getElementById('builder-name');
  if (!name) return;
  name.value = agentBlueprint.name;
  document.getElementById('builder-instructions').value = agentBlueprint.instructions;
  document.getElementById('builder-model').value = agentBlueprint.model;
  document.querySelectorAll('[data-builder-tool]').forEach(input => { input.checked = agentBlueprint.tools.includes(input.dataset.builderTool); });
  document.querySelectorAll('[data-builder-guardrail]').forEach(input => { input.checked = agentBlueprint.guardrails.includes(input.dataset.builderGuardrail); });
  document.getElementById('builder-handoff').value = agentBlueprint.handoff;
  document.getElementById('builder-session').checked = agentBlueprint.session;
  document.getElementById('builder-output').value = agentBlueprint.output;
}
function syncBlueprintFromBuilder() {
  if (!document.getElementById('builder-name')) return;
  agentBlueprint = sanitizeBlueprint({
    name: document.getElementById('builder-name').value,
    instructions: document.getElementById('builder-instructions').value,
    model: document.getElementById('builder-model').value,
    tools: [...document.querySelectorAll('[data-builder-tool]:checked')].map(input => input.dataset.builderTool),
    guardrails: [...document.querySelectorAll('[data-builder-guardrail]:checked')].map(input => input.dataset.builderGuardrail),
    handoff: document.getElementById('builder-handoff').value,
    session: document.getElementById('builder-session').checked,
    output: document.getElementById('builder-output').value
  });
  saveBlueprint();
  renderBlueprint();
  syncSimulatorFromBlueprint();
  if (document.getElementById('orchestration-canvas')) { renderOrchestrationCanvas(); renderGuardrailPipeline(); updateDesignBlueprintState(); }
  generateCode();
  refreshMastery();
}
function syncSimulatorFromBlueprint() {
  const model = document.getElementById('sim-model');
  if (!model) return;
  if ([...model.options].some(option => option.value === agentBlueprint.model)) model.value = agentBlueprint.model;
  document.getElementById('sim-instructions').value = agentBlueprint.instructions;
  document.getElementById('tool-websearch').checked = agentBlueprint.tools.includes('web_search');
  document.getElementById('tool-mcp').checked = agentBlueprint.tools.includes('mcp');
  document.getElementById('tool-functions').checked = agentBlueprint.tools.includes('function');
}
function renderBlueprint() {
  const root = document.getElementById('agent-blueprint');
  if (!root) return;
  const t = phase2Text[currentLang];
  const states = getBlueprintPartStates();
  const coverage = getBlueprintCoverage();
  const progress = `${coverage} / 8`;
  document.getElementById('blueprint-name').textContent = agentBlueprint.name.trim() || t.missing;
  document.getElementById('blueprint-mobile-name').textContent = agentBlueprint.name.trim() || t.missing;
  document.getElementById('blueprint-model').textContent = agentBlueprint.model;
  document.getElementById('blueprint-progress').textContent = progress;
  document.getElementById('blueprint-mobile-progress').textContent = progress;
  document.getElementById('builder-flow-coverage').textContent = progress;
  const progressTrack = root.querySelector('[role="progressbar"]');
  progressTrack.setAttribute('aria-valuenow', String(coverage));
  document.getElementById('blueprint-progress-bar').style.inlineSize = `${(coverage / 8) * 100}%`;
  document.getElementById('blueprint-instructions').textContent = agentBlueprint.instructions.trim() ? t.instructions_ready : t.missing;
  document.getElementById('blueprint-tools').textContent = agentBlueprint.tools.length ? String(agentBlueprint.tools.length) : t.none;
  document.getElementById('blueprint-guardrails').textContent = agentBlueprint.guardrails.length ? String(agentBlueprint.guardrails.length) : t.none;
  const handoffNames = { none: t.none, research: t.handoff_research, support: t.handoff_support };
  document.getElementById('blueprint-handoff').textContent = handoffNames[agentBlueprint.handoff];
  document.getElementById('blueprint-session').textContent = agentBlueprint.session ? t.on : t.off;
  document.getElementById('blueprint-output').textContent = agentBlueprint.output === 'structured' ? t.structured : t.text;

  document.querySelectorAll('[data-builder-part]').forEach(node => {
    const state = states[node.dataset.builderPart];
    node.dataset.state = state;
    node.setAttribute('aria-label', `${node.textContent.trim()} — ${t[state]}`);
  });
  const sectionStates = {
    identity: states.agent === 'configured' && states.instructions === 'configured' ? 'configured' : 'missing',
    model: states.model,
    tools: states.tools,
    guardrails: states.guardrails,
    handoff: states.handoff,
    session: states.session,
    output: states.output
  };
  document.querySelectorAll('[data-builder-status]').forEach(label => {
    const state = sectionStates[label.dataset.builderStatus];
    label.dataset.state = state;
    label.textContent = t[state];
  });
}
function toggleBlueprint(force) {
  const panel = document.getElementById('agent-blueprint');
  const open = typeof force === 'boolean' ? force : !panel.classList.contains('is-open');
  panel.classList.toggle('is-open', open);
  document.getElementById('blueprint-toggle').setAttribute('aria-expanded', String(open));
}
function editBlueprint() {
  switchTab('builder');
  toggleBlueprint(false);
  const heading = document.getElementById('builder-heading');
  heading.setAttribute('tabindex', '-1');
  heading.focus({preventScroll: true});
  heading.scrollIntoView({block: 'start', behavior: motionBehavior()});
}
function jumpToBuilderSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({block: 'start', behavior: motionBehavior()});
  const focusTarget = target.querySelector('input, textarea, select, button');
  if (focusTarget) setTimeout(() => focusTarget.focus({preventScroll: true}), 180);
}
function resetBlueprint() {
  if (!window.confirm(phase2Text[currentLang].reset_confirm)) return;
  agentBlueprint = sanitizeBlueprint(DEFAULT_BLUEPRINT);
  saveBlueprint();
  hydrateBuilder();
  renderBlueprint();
  syncSimulatorFromBlueprint();
  if (document.getElementById('orchestration-canvas')) syncDesignFromBlueprint();
  generateCode(); refreshMastery();
  showToast(phase2Text[currentLang].reset_done);
}


const MISSION_DEFS = [
  {id:'identity', title:'mission_1_title', desc:'mission_1_desc', target:'builder', anchor:'builder-identity'},
  {id:'tools', title:'mission_2_title', desc:'mission_2_desc', target:'builder', anchor:'builder-tools-card'},
  {id:'guardrails', title:'mission_3_title', desc:'mission_3_desc', target:'builder', anchor:'builder-guardrails-card'},
  {id:'orchestration', title:'mission_4_title', desc:'mission_4_desc', target:'architecture', anchor:'orchestration-designer'},
  {id:'simulation', title:'mission_5_title', desc:'mission_5_desc', target:'simulator'},
  {id:'approval', title:'mission_6_title', desc:'mission_6_desc', target:'simulator'},
  {id:'trace', title:'mission_7_title', desc:'mission_7_desc', target:'trace'},
  {id:'code', title:'mission_8_title', desc:'mission_8_desc', target:'codestudio'},
  {id:'quiz', title:'mission_9_title', desc:'mission_9_desc', target:'quiz', anchor:'knowledge-check'}
];
function loadMastery(){ try { const raw=JSON.parse(localStorage.getItem('agentlab.mastery')||'{}'); return {simulation:!!raw.simulation,approval:!!raw.approval,trace:!!raw.trace,code:!!raw.code,quizCorrect:Array.isArray(raw.quizCorrect)?[...new Set(raw.quizCorrect.filter(Number.isInteger))]:[]}; } catch(_){ return {simulation:false,approval:false,trace:false,code:false,quizCorrect:[]}; } }
let masteryState=loadMastery();
function saveMastery(){ try { localStorage.setItem('agentlab.mastery',JSON.stringify(masteryState)); } catch(_){} }
function missionIsComplete(id){
  const states=getBlueprintPartStates();
  if(id==='identity') return states.agent==='configured' && states.instructions==='configured';
  if(id==='tools') return agentBlueprint.tools.length>0;
  if(id==='guardrails') return agentBlueprint.guardrails.length>0;
  if(id==='orchestration') return agentBlueprint.handoff!=='none' || agentBlueprint.tools.includes('agent_tool');
  if(id==='simulation') return masteryState.simulation;
  if(id==='approval') return masteryState.approval;
  if(id==='trace') return masteryState.trace;
  if(id==='code') return masteryState.code;
  if(id==='quiz') return masteryState.quizCorrect.length===quizQuestions.length;
  return false;
}
function completedMissionCount(){ return MISSION_DEFS.filter(m=>missionIsComplete(m.id)).length; }
function masteryLevelFor(count){ const t=phase67Text[currentLang]; if(count>=9)return t.level_master; if(count>=6)return t.level_operator; if(count>=3)return t.level_builder; return t.level_explorer; }
function renderMasteryProgress(){
  const total=MISSION_DEFS.length, done=completedMissionCount(), pct=Math.round((done/total)*100), t=phase67Text[currentLang];
  const root=document.getElementById('mastery-progress'); if(!root)return;
  root.setAttribute('aria-valuemax',String(total)); root.setAttribute('aria-valuenow',String(done));
  document.getElementById('mastery-progress-bar').style.inlineSize=`${pct}%`;
  document.getElementById('mastery-progress-percent').textContent=`${pct}%`;
  document.getElementById('mastery-score-text').textContent=`${done} / ${total}`;
  document.getElementById('mastery-level').textContent=masteryLevelFor(done);
}
function renderMissions(){
  const list=document.getElementById('mission-list'); if(!list)return; const t=phase67Text[currentLang]; list.innerHTML='';
  MISSION_DEFS.forEach((m,index)=>{ const complete=missionIsComplete(m.id); const card=document.createElement('article'); card.className='mission-card'; card.dataset.complete=String(complete);
    const idx=document.createElement('span'); idx.className='mission-index'; idx.innerHTML=complete?'<i data-lucide="check"></i>':String(index+1).padStart(2,'0');
    const copy=document.createElement('div'); copy.className='mission-copy'; copy.innerHTML=`<strong>${t[m.title]}</strong><p>${t[m.desc]}</p>`;
    const actionWrap=document.createElement('div'); actionWrap.className='mission-status'; actionWrap.innerHTML=`<i data-lucide="${complete?'check-circle':'circle'}"></i><span>${complete?t.mission_complete:t.mission_continue}</span>`;
    const action=document.createElement('button'); action.type='button'; action.className='button button-secondary mission-action'; action.textContent=complete?t.mission_review:t.mission_start; action.onclick=()=>openMissionTarget(m.id);
    card.append(idx,copy,actionWrap,action); list.append(card);
  }); lucide.createIcons(list);
}
function refreshMastery(){ saveMastery(); renderMasteryProgress(); renderMissions(); }
function markMastery(key,value=true){ if(['simulation','approval','trace','code'].includes(key)){ masteryState[key]=value; refreshMastery(); } }
function openMissionTarget(id){ const m=MISSION_DEFS.find(x=>x.id===id); if(!m)return; switchTab(m.target); if(m.anchor){ setTimeout(()=>{ const el=document.getElementById(m.anchor); if(el)el.scrollIntoView({block:'start',behavior:motionBehavior()}); },80); } }

let currentCodeSection='full';
function updateCodeSummary(){
  if(!document.getElementById('code-summary-model'))return;
  document.getElementById('code-summary-model').textContent=agentBlueprint.model;
  document.getElementById('code-summary-tools').textContent=agentBlueprint.tools.length?String(agentBlueprint.tools.length):phase2Text[currentLang].none;
  document.getElementById('code-summary-guardrails').textContent=agentBlueprint.guardrails.length?String(agentBlueprint.guardrails.length):phase2Text[currentLang].none;
  document.getElementById('code-summary-output').textContent=agentBlueprint.output==='structured'?phase2Text[currentLang].structured:phase2Text[currentLang].text;
}
function handleCodePreferenceChange(){ generateCode(); }
function updateCodePresetAction(){ const select=document.getElementById('code-scenario'), btn=document.getElementById('apply-code-preset'); if(btn&&select) btn.disabled=select.value==='blueprint'; }
function selectCodeSection(section){ currentCodeSection=section; document.querySelectorAll('[data-code-section]').forEach(btn=>btn.setAttribute('aria-selected',String(btn.dataset.codeSection===section))); generateCode(); }
function safeQuoted(value){ return JSON.stringify(String(value??'')); }
function shellSingleQuoted(value){ return `'${String(value).replace(/'/g, `'\"'\"'`)}'`; }
function pythonLiteral(value){ if(value===true)return 'True'; if(value===false)return 'False'; if(value===null)return 'None'; if(Array.isArray(value))return '['+value.map(pythonLiteral).join(', ')+']'; if(typeof value==='object')return '{'+Object.entries(value).map(([k,v])=>`${safeQuoted(k)}: ${pythonLiteral(v)}`).join(', ')+'}'; return typeof value==='string'?safeQuoted(value):String(value); }
function blueprintToolObjects(){ return agentBlueprint.tools.map(tool=>({type:tool==='agent_tool'?'agent':tool})); }
function blueprintConfigObject(){ return {name:agentBlueprint.name,model:agentBlueprint.model,instructions:agentBlueprint.instructions,tools:blueprintToolObjects(),guardrails:agentBlueprint.guardrails,handoff:agentBlueprint.handoff,session_persistent:agentBlueprint.session,output_type:agentBlueprint.output}; }
function generateBlueprintCode(lang, section='full') {
  // Replaced by the verified educational-lab generator loaded later in this file.
  return JSON.stringify(blueprintConfigObject(), null, 2);
}
function applyCodePresetToBlueprint(){
  const scenario=document.getElementById('code-scenario')?.value; if(!scenario||scenario==='blueprint')return;
  const presets={
    quickstart:{name:'Quickstart Agent',instructions:'Answer clearly and use web search when current information is needed.',model:'gpt-6-astra',tools:['web_search'],guardrails:[],handoff:'none',session:true,output:'text'},
    mcp_tools:{name:'MCP Research Agent',instructions:'Research with connected MCP tools and return concise sourced findings.',model:'gpt-6-astra',tools:['web_search','mcp'],guardrails:['input'],handoff:'none',session:true,output:'structured'},
    multiagent:{name:'Research Coordinator',instructions:'Coordinate specialist agents, delegate focused subtasks, then synthesize one final answer.',model:'gpt-6-astra',tools:['web_search','mcp','agent_tool'],guardrails:['input','output'],handoff:'research',session:true,output:'structured'},
    functions:{name:'Approval Workflow Agent',instructions:'Use application functions only when needed and wait for human approval before sensitive calls.',model:'gpt-6-astra',tools:['function'],guardrails:['input','output'],handoff:'none',session:true,output:'text'}
  };
  agentBlueprint=sanitizeBlueprint(presets[scenario]); saveBlueprint(); hydrateBuilder(); renderBlueprint(); syncSimulatorFromBlueprint(); if(document.getElementById('orchestration-canvas'))syncDesignFromBlueprint(); generateCode(); refreshMastery(); showToast(phase67Text[currentLang].preset_applied);
}

function applyTheme() {
  const root = document.documentElement;
  root.classList.toggle('dark', currentTheme === 'dark');
  root.classList.toggle('light', currentTheme === 'light');
  const isDark = currentTheme === 'dark';
  document.getElementById('theme-icon').setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  const label = ui[currentLang][isDark ? 'switch_light' : 'switch_dark'];
  const button = document.getElementById('theme-switch-btn');
  button.setAttribute('aria-label', label);
  button.title = label;
  document.getElementById('theme-label').textContent = ui[currentLang][isDark ? 'light_mode' : 'dark_mode'];
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#0f172a' : '#f3f4f6';
  lucide.createIcons();
}
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme();
  savePreference('theme', currentTheme);
}
function translateShell() {
  translatePhase2();
  translatePhase3();
  translatePhase45();
  translatePhase67();
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = i18n[currentLang][el.dataset.i18n];
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll('[data-ui]').forEach(el => {
    const value = ui[currentLang][el.dataset.ui];
    if (value !== undefined) el.textContent = value;
  });
  document.getElementById('app-title').textContent = i18n[currentLang].title;
  document.getElementById('app-subtitle').textContent = i18n[currentLang].subtitle;
  const langLabel = document.getElementById('lang-label');
  langLabel.textContent = i18n[currentLang].lang_btn;
  langLabel.lang = currentLang === 'en' ? 'ar' : 'en';
  document.getElementById('lang-switch-btn').setAttribute('aria-label', ui[currentLang].switch_language);
  document.getElementById('lang-switch-btn').title = ui[currentLang].switch_language;
  document.getElementById('app-nav').setAttribute('aria-label', ui[currentLang].primary_nav);
  document.querySelector('.lesson-pagination').setAttribute('aria-label', ui[currentLang].module_nav);
  document.getElementById('sim-console').setAttribute('aria-label', ui[currentLang].events);
  document.querySelector('.code-output').setAttribute('aria-label', ui[currentLang].generated_code);
  document.getElementById('course-count').textContent = `${modulesData.length} ${ui[currentLang].topics}`;
  document.querySelectorAll('.nav-item').forEach(btn => {
    const fullName = btn.dataset.view === 'trace' ? phase45Text[currentLang].trace_title : btn.dataset.view === 'architecture' ? phase45Text[currentLang].design_title : btn.dataset.view === 'quiz' ? phase67Text[currentLang].challenge_title : i18n[currentLang][`nav_${btn.dataset.view}`];
    btn.title = fullName || btn.textContent.trim();
    btn.setAttribute('aria-label', fullName || btn.textContent.trim());
  });
  applyTheme();
}
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  translateShell();
  renderModulesList();
  renderModuleContent(currentModuleIndex);
  renderQuiz();
  renderBlueprint();
  savePreference('language', currentLang);
  lucide.createIcons();
}
function switchTab(tabId) {
  const panel = document.getElementById(`view-${tabId}`);
  if (!panel) return;
  currentTab = tabId;
  if (tabId === 'codestudio') { masteryState.code = true; saveMastery(); setTimeout(()=>{ generateCode(); refreshMastery(); },0); }
  if (tabId === 'quiz') setTimeout(()=>{ renderMissions(); renderMasteryProgress(); },0);
  document.querySelectorAll('.tab-view').forEach(view => {
    const active = view === panel;
    view.hidden = !active;
    view.classList.toggle('hidden', !active);
  });
  document.querySelectorAll('.nav-item').forEach(btn => {
    const active = btn.dataset.view === tabId;
    btn.classList.toggle('is-active', active);
    if (active) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
  });
  if (window.matchMedia('(max-width: 1279px)').matches) toggleBlueprint(false);
  window.scrollTo({top: 0, behavior: 'auto'});
}
function toggleCurriculum(force) {
  const panel = document.getElementById('curriculum-panel');
  const open = typeof force === 'boolean' ? force : !panel.classList.contains('is-open');
  panel.classList.toggle('is-open', open);
  document.getElementById('curriculum-toggle').setAttribute('aria-expanded', String(open));
}
function renderModulesList() {
  document.getElementById('module-list').innerHTML = modulesData.map((m, index) => `
    <button type="button" class="module-item ${index === currentModuleIndex ? 'is-active' : ''}" onclick="selectModule(${index}, true)" aria-controls="module-content-container" ${index === currentModuleIndex ? 'aria-current="step"' : ''}>
      <span class="module-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="module-item-label">${escapeHtml(m[`title_${currentLang}`].replace(/^\d+\.\s*/, ''))}</span>
    </button>`).join('');
  document.getElementById('current-module-label').textContent = modulesData[currentModuleIndex][`title_${currentLang}`];
}
function selectModule(index, focusContent = false) {
  if (!Number.isInteger(index) || index < 0 || index >= modulesData.length) return;
  const wasMobile = window.matchMedia('(max-width: 1023px)').matches;
  currentModuleIndex = index;
  renderModulesList();
  renderModuleContent(index);
  toggleCurriculum(false);
  if (focusContent) {
    const title = document.getElementById('module-title');
    title.focus({preventScroll: true});
    if (wasMobile) title.scrollIntoView({block: 'start', behavior: motionBehavior()});
  }
}
function renderModuleContent(index) {
  const module = modulesData[index];
  const body = module[`body_${currentLang}`].replace(/<h3\b/g, '<h4').replace(/<\/h3>/g, '</h4>');
  document.getElementById('module-content-container').innerHTML = `
    <div class="module-intro">
      <div class="module-kicker"><span class="module-badge">${ui[currentLang].module} ${String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">/ ${String(modulesData.length).padStart(2, '0')}</span></div>
      <h3 id="module-title" tabindex="-1">${escapeHtml(module[`title_${currentLang}`])}</h3>
      <p class="module-description">${escapeHtml(module[`desc_${currentLang}`])}</p>
    </div>
    <div class="lesson-body">${body}</div>`;
  document.getElementById('module-position').textContent = `${String(index + 1).padStart(2, '0')} / ${String(modulesData.length).padStart(2, '0')}`;
  document.getElementById('module-prev').disabled = index === 0;
  document.getElementById('module-next').disabled = index === modulesData.length - 1;
}
const simulationState = {
  status: 'idle', timer: null, queue: [], cursor: 0, timeline: [], events: [], pendingApproval: null,
  decision: null, sessionId: 'sess_idle', selectedEvent: -1
};
function timelineIcon(kind) {
  return {user: 'smartphone', agent: 'bot', tool: 'layers', handoff: 'network', guardrail: 'shield-check', approval: 'pause-circle', final: 'check-circle'}[kind] || 'info';
}
function simulationStatusText(state = simulationState.status) {
  return phase3Text[currentLang][`status_${state}`] || phase3Text[currentLang].status_idle;
}
function setSimulationStatus(state) {
  simulationState.status = state;
  const status = document.getElementById('sim-run-status');
  if (!status) return;
  status.dataset.state = state;
  status.textContent = simulationStatusText(state);
}
function timelineStepText(step) {
  const t = phase3Text[currentLang];
  return {
    title: step.titleKey ? (t[step.titleKey] || step.title || '') : (step.title || ''),
    description: step.descriptionKey ? (t[step.descriptionKey] || step.description || '') : (step.description || '')
  };
}
function timelineBadgeText(state) {
  const t = phase3Text[currentLang];
  return t[`step_${state}`] || t.step_complete;
}
function createTimelineElement(step, index) {
  const copy = timelineStepText(step);
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'timeline-step';
  row.dataset.kind = step.kind;
  row.dataset.state = step.state || 'complete';
  row.setAttribute('aria-label', `${copy.title}. ${copy.description}`);
  row.addEventListener('click', () => selectTechnicalEvent(step.eventIndex, true));

  const marker = document.createElement('span');
  marker.className = 'timeline-step-marker';
  marker.innerHTML = `<i data-lucide="${timelineIcon(step.kind)}"></i>`;

  const card = document.createElement('span');
  card.className = 'timeline-step-card';
  const top = document.createElement('span');
  top.className = 'timeline-step-top';
  const title = document.createElement('span');
  title.className = 'timeline-step-title';
  title.textContent = copy.title;
  const badge = document.createElement('span');
  badge.className = 'timeline-step-badge';
  badge.textContent = timelineBadgeText(step.state || 'complete');
  top.append(title, badge);
  const desc = document.createElement('span');
  desc.className = 'timeline-step-desc';
  desc.textContent = copy.description;
  const time = document.createElement('time');
  time.className = 'timeline-step-time';
  time.dateTime = step.timestamp || new Date().toISOString();
  time.textContent = step.timeLabel || new Date(step.timestamp || Date.now()).toLocaleTimeString();
  card.append(top, desc, time);
  row.append(marker, card);
  lucide.createIcons(row);
  return row;
}
function renderSimulationTimeline() {
  const timeline = document.getElementById('simulation-timeline');
  if (!timeline) return;
  timeline.innerHTML = '';
  timeline.classList.toggle('has-steps', simulationState.timeline.length > 0);
  if (!simulationState.timeline.length) {
    const empty = document.createElement('div');
    empty.id = 'timeline-placeholder';
    empty.className = 'timeline-empty';
    empty.innerHTML = '<span class="icon-wrap"><i data-lucide="play-circle"></i></span>';
    const p = document.createElement('p');
    p.dataset.p3 = 'timeline_empty';
    p.textContent = phase3Text[currentLang].timeline_empty;
    empty.append(p);
    timeline.append(empty);
    lucide.createIcons(empty);
  } else {
    simulationState.timeline.forEach((step, index) => timeline.append(createTimelineElement(step, index)));
  }
  const counter = document.getElementById('timeline-counter');
  if (counter) counter.textContent = `${simulationState.timeline.length} ${phase3Text[currentLang].steps}`;
}
function appendTimelineStep(step) {
  const timestamp = new Date();
  const eventIndex = appendSimLog(step.eventName || 'simulation.step', step.data || {});
  const timelineStep = {...step, timestamp: timestamp.toISOString(), timeLabel: timestamp.toLocaleTimeString(), eventIndex};
  simulationState.timeline.push(timelineStep);
  renderSimulationTimeline();
  buildTraceFromSimulation();
  return simulationState.timeline.length - 1;
}
function renderTechnicalEvents() {
  const consoleEl = document.getElementById('sim-console');
  if (!consoleEl) return;
  consoleEl.innerHTML = '';
  if (!simulationState.events.length) {
    const empty = document.createElement('div');
    empty.id = 'technical-empty';
    empty.className = 'technical-empty';
    empty.dataset.p3 = 'technical_empty';
    empty.textContent = phase3Text[currentLang].technical_empty;
    consoleEl.append(empty);
  } else {
    simulationState.events.forEach((entry, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `technical-event-button${index === simulationState.selectedEvent ? ' is-selected' : ''}`;
      button.addEventListener('click', () => selectTechnicalEvent(index, false));
      const num = document.createElement('span');
      num.className = 'technical-event-index';
      num.textContent = String(index + 1).padStart(2, '0');
      const name = document.createElement('span');
      name.className = 'technical-event-name';
      name.textContent = entry.eventName;
      button.append(num, name);
      consoleEl.append(button);
    });
  }
  const count = document.getElementById('technical-event-count');
  if (count) count.textContent = `${simulationState.events.length} ${phase3Text[currentLang].events}`;
}
function appendSimLog(eventName, data) {
  const entry = { eventName, data, timestamp: new Date().toISOString() };
  simulationState.events.push(entry);
  simulationState.selectedEvent = simulationState.events.length - 1;
  renderTechnicalEvents();
  selectTechnicalEvent(simulationState.selectedEvent, false);
  return simulationState.selectedEvent;
}
function selectTechnicalEvent(index, openDetails = false) {
  if (!Number.isInteger(index) || index < 0 || index >= simulationState.events.length) return;
  simulationState.selectedEvent = index;
  const event = simulationState.events[index];
  const name = document.getElementById('technical-selected-name');
  const payload = document.getElementById('technical-payload');
  if (name) name.textContent = event.eventName;
  if (payload) payload.textContent = JSON.stringify({event: event.eventName, timestamp: event.timestamp, data: event.data}, null, 2);
  renderTechnicalEvents();
  if (openDetails) document.getElementById('sim-technical-details').open = true;
}
function renderSimulationLanguage() {
  const status = document.getElementById('sim-run-status');
  if (status) status.textContent = simulationStatusText();
  const payload = document.getElementById('technical-payload');
  if (payload && simulationState.selectedEvent < 0) payload.textContent = phase3Text[currentLang].inspect_payload;
  renderSimulationTimeline();
  renderTechnicalEvents();
}
function showApprovalPanel(step, timelineIndex) {
  simulationState.pendingApproval = {step, timelineIndex};
  setSimulationStatus('waiting');
  const panel = document.getElementById('approval-panel');
  panel.classList.remove('hidden');
  document.getElementById('approval-tool').textContent = step.data.tool_name;
  document.getElementById('approval-agent').textContent = step.data.agent_name;
  document.getElementById('approval-call-id').textContent = step.data.call_id;
  document.getElementById('approval-arguments').textContent = JSON.stringify(step.data.arguments, null, 2);
  const toggle = document.getElementById('approval-arguments-toggle');
  toggle.setAttribute('aria-expanded', 'false');
  document.getElementById('approval-arguments').classList.add('hidden');
  const label = toggle.querySelector('[data-p3]');
  if (label) { label.dataset.p3 = 'view_arguments'; label.textContent = phase3Text[currentLang].view_arguments; }
  lucide.createIcons(panel);
  if (window.matchMedia('(max-width: 1023px)').matches) panel.scrollIntoView({block: 'nearest', behavior: motionBehavior()});
}
function toggleApprovalArguments() {
  const toggle = document.getElementById('approval-arguments-toggle');
  const args = document.getElementById('approval-arguments');
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  args.classList.toggle('hidden', !open);
  const label = toggle.querySelector('[data-p3]');
  if (label) {
    const key = open ? 'hide_arguments' : 'view_arguments';
    label.dataset.p3 = key;
    label.textContent = phase3Text[currentLang][key];
  }
}
function updatePendingTimelineState(state) {
  const pending = simulationState.pendingApproval;
  if (!pending) return;
  const timelineStep = simulationState.timeline[pending.timelineIndex];
  if (timelineStep) timelineStep.state = state;
  renderSimulationTimeline();
  buildTraceFromSimulation();
}
function resolveSimulationApproval(decision) {
  const pending = simulationState.pendingApproval;
  if (!pending || !['approve', 'reject'].includes(decision)) return;
  simulationState.decision = decision;
  masteryState.approval = true; saveMastery(); refreshMastery();
  document.getElementById('approval-panel').classList.add('hidden');
  updatePendingTimelineState(decision === 'approve' ? 'approved' : 'rejected');
  const step = pending.step;
  const eventName = decision === 'approve' ? phase3Text.en.approved_event : phase3Text.en.rejected_event;
  appendSimLog(eventName, {call_id: step.data.call_id, tool_name: step.data.tool_name, decision, run_state: 'resumable'});
  simulationState.pendingApproval = null;
  setSimulationStatus('running');

  if (decision === 'approve') {
    simulationState.queue.splice(simulationState.cursor, 0,
      {kind: 'tool', titleKey: 'function_approved', descriptionKey: 'function_approved_desc', eventName: 'function.approval_recorded', data: {call_id: step.data.call_id, decision: 'approved'}},
      {kind: 'tool', titleKey: 'function_result', descriptionKey: 'function_result_desc', eventName: 'function_span.completed', data: {tool_name: step.data.tool_name, call_id: step.data.call_id, output: {customer_id: '9421', status: 'active', tier: 'enterprise', balance: '$12,400'}}}
    );
  } else {
    simulationState.queue.splice(simulationState.cursor, 0,
      {kind: 'approval', titleKey: 'function_rejected', descriptionKey: 'function_rejected_desc', eventName: 'function_span.rejected', data: {tool_name: step.data.tool_name, call_id: step.data.call_id, decision: 'rejected'}}
    );
    const finalStep = simulationState.queue.find(item => item.kind === 'final');
    if (finalStep) finalStep.descriptionKey = 'final_response_rejected_desc';
  }
  scheduleSimulationStep(260);
}
function scheduleSimulationStep(delay = 520) {
  if (simulationState.timer) clearTimeout(simulationState.timer);
  simulationState.timer = setTimeout(playNextSimulationStep, delay);
}
function playNextSimulationStep() {
  if (simulationState.cursor >= simulationState.queue.length) {
    completeSimulationRun();
    return;
  }
  const step = simulationState.queue[simulationState.cursor++];
  if (step.requiresApproval) {
    step.state = 'waiting';
    const timelineIndex = appendTimelineStep(step);
    showApprovalPanel(step, timelineIndex);
    return;
  }
  appendTimelineStep({...step, state: step.state || 'complete'});
  scheduleSimulationStep(step.kind === 'final' ? 380 : 520);
}
function completeSimulationRun() {
  if (simulationState.timer) clearTimeout(simulationState.timer);
  simulationState.timer = null;
  setSimulationStatus(simulationState.decision === 'reject' ? 'rejected' : 'completed');
  appendSimLog('run.completed', {session_id: simulationState.sessionId, outcome: simulationState.decision === 'reject' ? 'completed_with_rejection' : 'completed'});
  buildTraceFromSimulation();
  masteryState.simulation = true; saveMastery(); refreshMastery();
}


const traceState = { spans: [], selectedId: null, query: '', kind: 'all', run: null };
function traceKindFromStep(step) { return ['user','agent','tool','handoff','guardrail','approval','final'].includes(step.kind) ? step.kind : 'agent'; }
function traceKindIcon(kind) { return {user:'message-square',agent:'bot',tool:'wrench',handoff:'git-branch',guardrail:'shield-check',approval:'user-check',final:'check-circle'}[kind] || 'circle'; }
function traceKindLabel(kind) { return phase45Text[currentLang][`kind_${kind}`] || kind; }
function traceStatusLabel(status) { return phase45Text[currentLang][`status_${status}`] || status || phase45Text[currentLang].status_complete; }
function durationForTraceStep(step, index) {
  const base = {user:8,agent:86,tool:144,handoff:210,guardrail:42,approval:0,final:68}[step.kind] ?? 55;
  if (step.state === 'waiting') return 0;
  return base + (index * 17 % 61);
}
function buildTraceFromSimulation() {
  if (!simulationState.timeline.length) return traceState.spans;
  const runRoot = `run_${simulationState.sessionId.replace(/[^a-zA-Z0-9_-]/g,'')}`;
  let agentSpanId = null;
  traceState.spans = simulationState.timeline.map((step,index) => {
    const kind = traceKindFromStep(step);
    const spanId = `span_${String(index+1).padStart(3,'0')}`;
    if (kind === 'agent' && !agentSpanId) agentSpanId = spanId;
    const parent = kind === 'user' || kind === 'agent' || kind === 'final' ? runRoot : (agentSpanId || runRoot);
    const copy = timelineStepText(step);
    const status = step.state || 'complete';
    const duration = durationForTraceStep(step,index);
    return { id:spanId, parentId:parent, runRoot, index, depth: parent === runRoot ? 0 : 1, kind, title:copy.title, description:copy.description, status, duration, timestamp:step.timestamp || new Date().toISOString(), eventIndex:step.eventIndex, payload:step.data || {} };
  });
  traceState.run = { sessionId:simulationState.sessionId, agent:agentBlueprint.name || 'Research Agent', model:document.getElementById('sim-model')?.value || agentBlueprint.model, status:simulationState.status, updatedAt:new Date().toISOString() };
  if (!traceState.selectedId || !traceState.spans.some(span => span.id === traceState.selectedId)) traceState.selectedId = traceState.spans[0]?.id || null;
  try { localStorage.setItem('agentlab.latestTrace', JSON.stringify({spans:traceState.spans, run:traceState.run, selectedId:traceState.selectedId})); } catch (_) {}
  renderTraceInspector();
  return traceState.spans;
}
function loadLatestTrace() {
  try {
    const stored = JSON.parse(localStorage.getItem('agentlab.latestTrace') || 'null');
    if (stored && Array.isArray(stored.spans)) { traceState.spans = stored.spans; traceState.run = stored.run || null; traceState.selectedId = stored.selectedId || stored.spans[0]?.id || null; }
  } catch (_) {}
}
function setTraceFilter() {
  traceState.query = (document.getElementById('trace-search')?.value || '').trim().toLowerCase();
  traceState.kind = document.getElementById('trace-kind-filter')?.value || 'all';
  renderTraceInspector();
}
function selectTraceSpan(id) { if (!traceState.spans.some(span => span.id === id)) return; traceState.selectedId = id; masteryState.trace = true; saveMastery(); refreshMastery(); renderTraceInspector(); }
function renderTraceInspector() {
  const list = document.getElementById('trace-span-list'); if (!list) return;
  const t = phase45Text[currentLang];
  const spans = traceState.spans || [];
  document.getElementById('trace-total-spans').textContent = String(spans.length);
  document.getElementById('trace-tool-spans').textContent = String(spans.filter(s=>s.kind==='tool').length);
  document.getElementById('trace-handoff-spans').textContent = String(spans.filter(s=>s.kind==='handoff').length);
  document.getElementById('trace-guardrail-spans').textContent = String(spans.filter(s=>s.kind==='guardrail').length);
  document.getElementById('trace-run-agent').textContent = traceState.run?.agent || '—';
  document.getElementById('trace-run-id').textContent = traceState.run?.sessionId || 'sess_idle';
  document.getElementById('trace-run-model').textContent = traceState.run?.model || '—';
  const filtered = spans.filter(span => (traceState.kind==='all' || span.kind===traceState.kind) && (!traceState.query || `${span.title} ${span.description} ${span.kind} ${span.id}`.toLowerCase().includes(traceState.query)));
  document.getElementById('trace-visible-count').textContent = `${filtered.length} / ${spans.length}`;
  list.innerHTML = '';
  if (!spans.length) { const empty=document.createElement('div'); empty.className='trace-empty'; empty.textContent=t.trace_empty; list.append(empty); }
  else if (!filtered.length) { const empty=document.createElement('div'); empty.className='trace-empty'; empty.textContent=t.no_trace_match; list.append(empty); }
  else filtered.forEach(span => {
    const b=document.createElement('button'); b.type='button'; b.className=`trace-span${span.id===traceState.selectedId?' is-selected':''}`; b.dataset.kind=span.kind; b.style.setProperty('--trace-depth',String(span.depth||0)); b.setAttribute('role','listitem'); b.setAttribute('aria-pressed',String(span.id===traceState.selectedId)); b.onclick=()=>selectTraceSpan(span.id);
    const icon=document.createElement('span'); icon.className='trace-span-icon'; icon.innerHTML=`<i data-lucide="${traceKindIcon(span.kind)}"></i>`;
    const copy=document.createElement('span'); copy.className='trace-span-copy'; const strong=document.createElement('strong'); strong.textContent=span.title; const meta=document.createElement('span'); meta.textContent=`${traceKindLabel(span.kind)} · ${traceStatusLabel(span.status)}`; copy.append(strong,meta);
    const dur=document.createElement('span'); dur.className='trace-span-duration'; dur.textContent=span.duration ? `${span.duration} ms` : '—'; b.append(icon,copy,dur); list.append(b);
  });
  const selected = filtered.length ? (filtered.find(s=>s.id===traceState.selectedId) || filtered[0]) : (spans.find(s=>s.id===traceState.selectedId) || spans[0]);
  if (selected) {
    traceState.selectedId=selected.id; document.getElementById('trace-inspector-title').textContent=selected.title; document.getElementById('trace-inspector-kind').textContent=traceKindLabel(selected.kind); document.getElementById('trace-inspector-id').textContent=selected.id; document.getElementById('trace-inspector-parent').textContent=selected.parentId || t.root; document.getElementById('trace-inspector-status').textContent=traceStatusLabel(selected.status); document.getElementById('trace-inspector-duration').textContent=selected.duration?`${selected.duration} ms`:'—'; document.getElementById('trace-inspector-time').textContent=new Date(selected.timestamp).toLocaleTimeString(); document.getElementById('trace-inspector-payload').textContent=JSON.stringify({span_id:selected.id,parent_span_id:selected.parentId,kind:selected.kind,status:selected.status,event_index:selected.eventIndex,payload:selected.payload},null,2);
  } else { document.getElementById('trace-inspector-title').textContent='—'; document.getElementById('trace-inspector-kind').textContent='—'; document.getElementById('trace-inspector-id').textContent='—'; document.getElementById('trace-inspector-parent').textContent='—'; document.getElementById('trace-inspector-status').textContent='—'; document.getElementById('trace-inspector-duration').textContent='—'; document.getElementById('trace-inspector-time').textContent='—'; document.getElementById('trace-inspector-payload').textContent=t.trace_empty; }
  lucide.createIcons(list);
}

let orchestrationPattern = 'single';
const ORCHESTRATION_PATTERNS = {
  single:{titleKey:'pattern_single',descKey:'single_desc',nodes:[['user','smartphone','User'],['agent','bot','Agent'],['tool','wrench','Tools'],['response','check-circle','Response']]},
  manager:{titleKey:'pattern_manager',descKey:'manager_desc',nodes:[['user','smartphone','User'],['agent','bot','Manager'],['branch','split','Specialists'],['agent','merge','Synthesis'],['response','check-circle','Response']]},
  handoff:{titleKey:'pattern_handoff',descKey:'handoff_desc2',nodes:[['user','smartphone','User'],['agent','list-tree','Triage'],['handoff','git-branch','Handoff'],['agent','bot','Specialist'],['response','check-circle','Response']]},
  parallel:{titleKey:'pattern_parallel',descKey:'parallel_desc',nodes:[['user','smartphone','User'],['agent','waypoints','Coordinator'],['branch','split','Parallel'],['agent','merge','Synthesis'],['response','check-circle','Response']]},
  approval:{titleKey:'pattern_approval',descKey:'approval_desc2',nodes:[['user','smartphone','User'],['agent','bot','Agent'],['tool','wrench','Tool'],['approval','user-check','Approval'],['response','check-circle','Response']]}
};
function recommendedOrchestrationPattern() { if (agentBlueprint.handoff!=='none') return 'handoff'; if (agentBlueprint.tools.includes('agent_tool')) return 'manager'; if (agentBlueprint.tools.includes('function')) return 'approval'; return 'single'; }
function selectOrchestrationPattern(pattern, synced=false) { if (!ORCHESTRATION_PATTERNS[pattern]) return; orchestrationPattern=pattern; document.querySelectorAll('[data-orchestration]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.orchestration===pattern))); renderOrchestrationCanvas(); updateDesignBlueprintState(synced); }
function renderOrchestrationCanvas() {
  const canvas=document.getElementById('orchestration-canvas'); if(!canvas) return; const pattern=ORCHESTRATION_PATTERNS[orchestrationPattern]||ORCHESTRATION_PATTERNS.single; const t=phase45Text[currentLang]; canvas.innerHTML=''; const flow=document.createElement('div'); flow.className='orch-flow';
  pattern.nodes.forEach((node,index)=>{ if(index){const a=document.createElement('span');a.className='orch-arrow';a.setAttribute('aria-hidden','true');a.textContent='→';flow.append(a);} if(node[0]==='branch'){const branch=document.createElement('div');branch.className='orch-branch';const label=document.createElement('span');label.className='orch-branch-label';label.textContent=node[2];const row=document.createElement('div');row.className='orch-branch-row';const names=orchestrationPattern==='parallel'?['Research','Docs','Data']:['Research','Support'];names.forEach(name=>{const n=document.createElement('div');n.className='orch-node';n.dataset.kind='agent';n.innerHTML=`<i data-lucide="bot"></i><strong>${name}</strong><small>${orchestrationPattern==='manager'?'agent as tool':'specialist'}</small>`;row.append(n)});branch.append(label,row);flow.append(branch);} else {const n=document.createElement('div');n.className='orch-node';n.dataset.kind=node[0];let label=node[2];if(node[0]==='agent'&&label==='Agent')label=agentBlueprint.name||'Agent'; if(node[0]==='agent'&&label==='Specialist')label=agentBlueprint.handoff==='support'?'Support':'Research';n.innerHTML=`<i data-lucide="${node[1]}"></i><strong>${escapeHtml(label)}</strong><small>${traceKindLabel(node[0]==='response'?'final':node[0])}</small>`;flow.append(n);}}); canvas.append(flow); document.getElementById('orchestration-pattern-title').textContent=t[pattern.titleKey]; document.getElementById('orchestration-pattern-desc').textContent=t[pattern.descKey]; lucide.createIcons(canvas);
}
function updateDesignBlueprintState(synced=false) { const fit=document.getElementById('orchestration-fit'); if(!fit)return; const t=phase45Text[currentLang]; const recommended=recommendedOrchestrationPattern(); const matches=recommended===orchestrationPattern; fit.dataset.state=matches?'configured':'neutral'; fit.textContent=matches?t.fit_recommended:t.fit_available; document.getElementById('orchestration-fit-text').textContent=synced?t.fit_synced:(matches?t.fit_recommended:t.fit_available); const count=agentBlueprint.guardrails.length; document.getElementById('guardrail-blueprint-status').textContent=`${count} ${t.guardrail_configured}`; }
function syncDesignFromBlueprint() { selectOrchestrationPattern(recommendedOrchestrationPattern(),true); renderGuardrailPipeline(); }

let guardrailVisualState = {scenario:'safe',ran:false,stages:[]};
function computeGuardrailStages(scenario='safe') {
  const inputConfigured=agentBlueprint.guardrails.includes('input'); const outputConfigured=agentBlueprint.guardrails.includes('output');
  const stages=[
    {key:'user',icon:'message-square',label:'stage_user',state:'passed',detail:'stage_processed'},
    {key:'input',icon:'shield-check',label:'stage_input',state:inputConfigured?'passed':'skipped',detail:inputConfigured?'passed':'stage_not_configured'},
    {key:'agent',icon:'bot',label:'stage_agent',state:'passed',detail:'stage_processed'},
    {key:'tool',icon:'shield',label:'stage_tool',state:'passed',detail:'stage_allowed'},
    {key:'output',icon:'shield-check',label:'stage_output',state:outputConfigured?'passed':'skipped',detail:outputConfigured?'passed':'stage_not_configured'},
    {key:'response',icon:'check-circle',label:'stage_response',state:'passed',detail:'stage_allowed'}
  ];
  const blockedKey={input_blocked:'input',tool_blocked:'tool',output_blocked:'output'}[scenario];
  if(blockedKey){ const blockedIndex=stages.findIndex(s=>s.key===blockedKey); stages[blockedIndex].state='blocked'; stages[blockedIndex].detail='blocked'; for(let i=blockedIndex+1;i<stages.length;i++){stages[i].state='skipped'; stages[i].detail='stage_not_run';} }
  return stages;
}
function renderGuardrailPipeline() { const root=document.getElementById('guardrail-pipeline'); if(!root)return; const t=phase45Text[currentLang]; const stages=guardrailVisualState.ran?guardrailVisualState.stages:computeGuardrailStages('safe').map(s=>({...s,state:s.key==='user'?'passed':'skipped',detail:s.key==='user'?'stage_processed':'stage_not_run'})); root.innerHTML=''; stages.forEach((stage,index)=>{if(index){const c=document.createElement('span');c.className='guardrail-connector';const prior=stages[index-1];if(prior.state==='blocked')c.dataset.state='blocked';root.append(c);}const n=document.createElement('div');n.className='guardrail-stage';n.dataset.state=stage.state;n.setAttribute('role','listitem');n.innerHTML=`<i data-lucide="${stage.icon}"></i><strong>${t[stage.label]}</strong><span>${t[stage.detail]||t[stage.state]||stage.detail}</span>`;root.append(n);}); lucide.createIcons(root); updateDesignBlueprintState(); }
function runGuardrailScenario() { const select=document.getElementById('guardrail-scenario'); const scenario=select?.value||'safe'; guardrailVisualState={scenario,ran:true,stages:computeGuardrailStages(scenario)}; renderGuardrailPipeline(); const result=document.getElementById('guardrail-result'); const t=phase45Text[currentLang]; const key={safe:'safe_result',input_blocked:'input_block_result',tool_blocked:'tool_block_result',output_blocked:'output_block_result'}[scenario]; result.dataset.state=scenario==='safe'?'passed':'blocked'; result.innerHTML=`<i data-lucide="${scenario==='safe'?'check-circle':'shield-alert'}"></i><span>${t[key]} ${scenario!=='safe'?t.scenario_demo_note:''}</span>`; lucide.createIcons(result); }
function initializePhase45() { loadLatestTrace(); renderTraceInspector(); selectOrchestrationPattern(recommendedOrchestrationPattern()); renderGuardrailPipeline(); updateDesignBlueprintState(); }

function selectArchNode(type) {
  highlightArchNode(type);
  document.querySelectorAll('.arch-node').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.node === type)));
}
function showToast(message) {
  clearTimeout(toastTimeout);
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.getElementById('toast-region').replaceChildren(toast);
  toastTimeout = setTimeout(() => document.getElementById('toast-region').replaceChildren(), 3500);
}
async function copyGeneratedCode() {
  const text = document.getElementById('code-display').textContent;
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      copied = true;
    }
  } catch (_) { /* Use a local-file-compatible fallback when clipboard access is denied. */ }
  if (!copied) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;inset-inline-start:-9999px;inset-block-start:0;';
    document.body.append(field);
    const previousFocus = document.activeElement;
    field.select();
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    field.remove();
    previousFocus?.focus({preventScroll: true});
  }
  if (!copied) {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('code-display'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.querySelector('.code-output').focus({preventScroll: true});
  }
  showToast(ui[currentLang][copied ? 'copied' : 'copy_failed']);
}
function renderQuiz() {
  document.getElementById('quiz-card-container').innerHTML = quizQuestions.map((q, index) => `
    <article class="quiz-card" aria-labelledby="quiz-question-${index}">
      <p class="eyebrow">${currentLang === 'en' ? `Question ${index + 1} of ${quizQuestions.length}` : `السؤال ${index + 1} من ${quizQuestions.length}`}</p>
      <h3 id="quiz-question-${index}">${escapeHtml(q[`q_${currentLang}`])}</h3>
      <div class="quiz-options" role="group" aria-labelledby="quiz-question-${index}">
        ${q[`options_${currentLang}`].map((option, optionIndex) => `<button type="button" class="quiz-option" onclick="checkQuizAnswer(${index}, ${optionIndex})" id="quiz-opt-${index}-${optionIndex}" aria-pressed="false" aria-describedby="quiz-explanation-${index}">${escapeHtml(option)}</button>`).join('')}
      </div>
      <div id="quiz-explanation-${index}" class="quiz-feedback hidden" role="status" aria-live="polite"></div>
    </article>`).join('');
  quizUiAnswers.forEach((selection, index) => paintQuizAnswer(index, selection));
}
function paintQuizAnswer(index, selection) {
  const q = quizQuestions[index];
  const correct = selection === q.correct;
  const explanation = document.getElementById(`quiz-explanation-${index}`);
  explanation.className = 'quiz-feedback';
  explanation.dataset.state = correct ? 'correct' : 'incorrect';
  explanation.textContent = (correct ? '✓ ' : '✗ ') + (currentLang === 'en' ? (correct ? 'Correct! ' : 'Incorrect. ') : (correct ? 'صحيح! ' : 'غير صحيح. ')) + q[`explanation_${currentLang}`];
  q.options_en.forEach((_, optionIndex) => document.getElementById(`quiz-opt-${index}-${optionIndex}`).setAttribute('aria-pressed', String(optionIndex === selection)));
}
function checkQuizAnswer(index, selectedOption) {
  const question = quizQuestions[index];
  if (!question || !Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= question.options_en.length) return;
  quizUiAnswers.set(index, selectedOption);
  paintQuizAnswer(index, selectedOption);
  const correctIndexes=[...quizUiAnswers.entries()].filter(([qIndex,answer])=>quizQuestions[qIndex] && quizQuestions[qIndex].correct===answer).map(([qIndex])=>qIndex);
  quizScore=correctIndexes.length;
  document.getElementById('quiz-score').textContent = `${quizScore} / ${quizQuestions.length}`;
  masteryState.quizCorrect=correctIndexes; saveMastery(); refreshMastery();
}
function initializeShell() {
  translateShell();
  renderModulesList();
  renderModuleContent(currentModuleIndex);
  masteryState.quizCorrect.forEach(index=>{ const q=quizQuestions[index]; if(q) quizUiAnswers.set(index,q.correct); });
  renderQuiz();
  quizScore=masteryState.quizCorrect.length; document.getElementById('quiz-score').textContent=`${quizScore} / ${quizQuestions.length}`;
  renderMissions(); renderMasteryProgress();
  generateCode();
  hydrateBuilder();
  renderBlueprint();
  syncSimulatorFromBlueprint();
  initializePhase45();
  document.querySelectorAll('#view-builder input, #view-builder textarea, #view-builder select').forEach(control => {
    control.addEventListener(control.matches('input[type="text"], textarea') ? 'input' : 'change', syncBlueprintFromBuilder);
  });
  lucide.createIcons();
  document.getElementById('app-nav').addEventListener('keydown', event => {
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!allowedKeys.includes(event.key) || !event.target.closest('.nav-item')) return;
    const items = [...document.querySelectorAll('.nav-item')];
    let index = items.indexOf(event.target.closest('.nav-item'));
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = items.length - 1;
    else {
      let forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
      if (document.documentElement.dir === 'rtl' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) forward = !forward;
      index = (index + (forward ? 1 : -1) + items.length) % items.length;
    }
    event.preventDefault();
    items[index].focus();
  });
  document.getElementById('curriculum-panel').addEventListener('keydown', event => {
    if (event.key === 'Escape' && window.matchMedia('(max-width: 1023px)').matches) {
      toggleCurriculum(false);
      document.getElementById('curriculum-toggle').focus();
    }
  });
  document.getElementById('agent-blueprint').addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      toggleBlueprint(false);
      document.getElementById('blueprint-toggle').focus();
    }
  });
}
document.addEventListener('DOMContentLoaded', initializeShell);

        function highlightArchNode(nodeType) {
            const titleEl = document.getElementById('arch-detail-title');
            const descEl = document.getElementById('arch-detail-desc');

            const info = {
                client: {
                    title: "01. Client Application & SDK",
                    desc: "Your application calls the Agents SDK Runner or uses the Responses API directly when it owns the orchestration loop."
                },
                harness: {
                    title: "02. Agents SDK Runner",
                    desc: "Runner manages the agent loop, tools, handoffs, guardrails, approvals, sessions and trace instrumentation around model calls."
                },
                environment: {
                    title: "03. Execution Environment & Sandboxes",
                    desc: "Sessions provide memory across runs; RunState represents a paused run that can be resumed after an approval decision."
                },
                tools: {
                    title: "04. MCP Servers & Subagents",
                    desc: "Connects to stdio or HTTP MCP servers for custom capabilities and spawns parallel subagents to handle isolated research sub-tasks."
                }
            };

            if (info[nodeType]) {
                titleEl.textContent = info[nodeType].title;
                descEl.textContent = info[nodeType].desc;
            }
        }

        function generateCode() {
            const langEl = document.getElementById('code-lang');
            const codeDisplay = document.getElementById('code-display');
            const fileName = document.getElementById('code-file-name');
            if (!langEl || !codeDisplay || !fileName) return;
            const lang = langEl.value;
            const ext = lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : 'sh';
            fileName.textContent = `agent_blueprint.${ext}`;
            codeDisplay.textContent = generateBlueprintCode(lang, currentCodeSection);
            updateCodeSummary();
            updateCodePresetAction();
        }


        function buildSimulationQueue(prompt, model, env) {
            const queue = [
              {kind: 'user', titleKey: 'user_request', description: prompt, eventName: 'run.input.received', data: {type: 'user_message', content: prompt}},
              {kind: 'agent', titleKey: 'agent_started', descriptionKey: 'agent_started_desc', eventName: 'agent_span.started', data: {agent_name: agentBlueprint.name || 'Research Agent', model, environment: env}}
            ];
            if (agentBlueprint.guardrails.includes('input')) queue.push({kind: 'guardrail', titleKey: 'input_guardrail', descriptionKey: 'input_guardrail_desc', eventName: 'guardrail_span.completed', data: {guardrail: 'input', result: 'passed'}});
            if (document.getElementById('tool-websearch').checked) queue.push({kind: 'tool', titleKey: 'web_search', descriptionKey: 'web_search_desc', eventName: 'tool.web_search.completed', data: {query: 'OpenAI Agents SDK current release notes', result: 'simulated search results'}});
            if (document.getElementById('tool-mcp').checked) queue.push({kind: 'tool', titleKey: 'mcp_call', descriptionKey: 'mcp_call_desc', eventName: 'tool.mcp.completed', data: {server_label: 'openai_docs', transport: 'http', result: 'simulated documentation context'}});
            if (document.getElementById('tool-multiagent').checked || agentBlueprint.tools.includes('agent_tool') || agentBlueprint.handoff !== 'none') queue.push({kind: 'handoff', titleKey: 'specialist', descriptionKey: 'specialist_desc', eventName: agentBlueprint.handoff !== 'none' ? 'handoff_span.completed' : 'agent_tool.completed', data: {specialist: agentBlueprint.handoff === 'support' ? 'Support specialist' : 'Research specialist', task: 'Compare release notes'}});
            if (document.getElementById('tool-functions').checked) queue.push({
              kind: 'approval', titleKey: 'function_request', descriptionKey: 'function_request_desc', eventName: 'approval.interruption', requiresApproval: true,
              data: {type: 'ToolApprovalItem', agent_name: agentBlueprint.name || 'Research Agent', tool_name: 'query_customer_db', call_id: 'call_x9421', arguments: {customer_id: '9421'}, next_step: 'result.to_state() → state.approve(...) / state.reject(...) → Runner.run(agent, state)'}
            });
            if (agentBlueprint.guardrails.includes('output')) queue.push({kind: 'guardrail', titleKey: 'output_guardrail', descriptionKey: 'output_guardrail_desc', eventName: 'guardrail_span.completed', data: {guardrail: 'output', result: 'passed'}});
            queue.push({kind: 'final', titleKey: 'final_response', descriptionKey: 'final_response_desc', eventName: 'run.output.ready', data: {output_type: agentBlueprint.output, status: 'ready'}});
            return queue;
        }

        function runSimulation() {
            clearSimulationState(false);
            if (window.matchMedia('(max-width: 1023px)').matches) {
                document.getElementById('stream-panel').scrollIntoView({block: 'start', behavior: motionBehavior()});
            }
            const model = document.getElementById('sim-model').value;
            const env = document.getElementById('sim-environment').value;
            const prompt = document.getElementById('sim-prompt').value.trim() || 'Run the configured agent.';
            const sessId = 'sess_' + Math.random().toString(36).substring(2, 9);
            simulationState.sessionId = sessId;
            simulationState.queue = buildSimulationQueue(prompt, model, env);
            simulationState.cursor = 0;
            simulationState.decision = null;
            document.getElementById('session-id-display').textContent = sessId;
            document.getElementById('sim-run-agent').textContent = agentBlueprint.name || 'Research Agent';
            document.getElementById('sim-run-model').textContent = model;
            setSimulationStatus('running');
            appendSimLog('run.started', {session_id: sessId, agent_name: agentBlueprint.name || 'Research Agent', model, environment: env, queue_length: simulationState.queue.length});
            scheduleSimulationStep(180);
        }

        function submitFunctionResult() {
            // Backward-compatible alias retained for the original training content.
            resolveSimulationApproval('approve');
        }

        function clearSimulationState(resetHeader = true) {
            if (simulationState.timer) clearTimeout(simulationState.timer);
            simulationState.timer = null;
            simulationState.queue = [];
            simulationState.cursor = 0;
            simulationState.timeline = [];
            simulationState.events = [];
            simulationState.pendingApproval = null;
            simulationState.decision = null;
            simulationState.selectedEvent = -1;
            document.getElementById('approval-panel').classList.add('hidden');
            document.getElementById('approval-arguments').classList.add('hidden');
            document.getElementById('approval-arguments-toggle').setAttribute('aria-expanded', 'false');
            document.getElementById('sim-technical-details').open = false;
            document.getElementById('technical-selected-name').textContent = '—';
            document.getElementById('technical-payload').textContent = phase3Text[currentLang].inspect_payload;
            if (resetHeader) {
              simulationState.sessionId = 'sess_idle';
              document.getElementById('session-id-display').textContent = 'sess_idle';
              document.getElementById('sim-run-agent').textContent = agentBlueprint.name || 'Research Agent';
              document.getElementById('sim-run-model').textContent = document.getElementById('sim-model').value;
              setSimulationStatus('idle');
            }
            renderSimulationTimeline();
            renderTechnicalEvents();
        }

        function clearConsole() {
            clearSimulationState(true);
        }

/* Educational Lab enhancement runtime — local simulation only. */
var LAB_VERSION = '2026-09-12';
var LAB_DEFAULTS = {
  description: 'Create a research agent that can search the web, use a documentation MCP server, ask for approval before sensitive actions, and return structured findings.',
  functionTool: {
    name: 'query_customer_db',
    description: 'Look up customer account details by customer ID.',
    args: [{name:'customer_id', type:'string', required:true, example:'9421'}],
    approval: 'always',
    approvalRule: 'amount > 5000',
    simulatedResult: {customer_id:'9421', status:'active', tier:'enterprise'}
  },
  mcp: {
    serverLabel: 'docs_server', transport: 'hosted', serverUrl: 'https://example.com/mcp', approval: 'never',
    availableTools: ['search_docs','get_page','list_sections']
  },
  outputSchema: {
    fields: [
      {name:'summary', type:'string', required:true, description:'Short answer for the user'},
      {name:'sources', type:'array', required:true, description:'Sources used during the run'},
      {name:'risk_level', type:'enum', required:true, description:'low | medium | high'},
      {name:'next_action', type:'string', required:true, description:'Recommended next action'}
    ]
  }
};
var labState = {
  builderView: 'visual', proposal: null, previousConfig: null,
  learningMode: 'explore', guidedStep: 0,
  lastOutcome: null, lastFailure: null,
  customOrchestration: {nodes:[], edges:[]},
  codeBaseline: null, codeDiffOpen: false
};

function labCopy(value){ return JSON.parse(JSON.stringify(value)); }
function labT(en, ar){ return currentLang === 'ar' ? ar : en; }
function safeJsonParse(text, fallback){ try { return JSON.parse(text); } catch(_){ return fallback; } }
function labId(prefix){ return prefix + '_' + Math.random().toString(36).slice(2,8); }
function escapeAttr(value){ return escapeHtml(value).replace(/`/g,'&#96;'); }

var labAr = {
  mode_label:'وضع التعلّم', mode_explore:'استكشاف', mode_guided:'موجّه', guided_continue:'متابعة',
  simulation:'محاكاة', training_representation:'تمثيل تدريبي', verified_sdk:'مثال SDK تم التحقق منه',
  home_eyebrow:'الصفحة التعليمية', home_title:'تابع مختبر الوكلاء', home_desc:'اعرف أين وصلت، وما بنيته، وما المهارة التالية التي تحتاج لإثباتها.', home_mastery:'الإتقان', home_blueprint:'المخطط الحالي', home_next:'المهمة التالية', home_last_run:'آخر محاكاة', home_trace:'آخر تتبع', home_course:'تقدم الدورة', continue_learning:'متابعة التعلّم',
  describe_eyebrow:'بداية للمبتدئ', describe_title:'صف وكيلك', describe_desc:'اشرح ما تريده بلغة عادية. سيقترح هذا المختبر المحلي مخططاً تدريبياً دون الاتصال بأي API.', describe_label:'ماذا يجب أن يفعل الوكيل؟', starter_research:'وكيل أبحاث', starter_support:'وكيل دعم', starter_approval:'تدفق موافقة', generate_blueprint:'إنشاء مخطط الوكيل',
  tf_description:'الوصف الطبيعي', tf_requirements:'المتطلبات المفهومة', tf_blueprint:'مخطط الوكيل', tf_config:'الإعداد / JSON', tf_code:'كود SDK', tf_sim:'المحاكاة', transform_explain:'وصفت السلوك بلغة عادية. حوّل المختبر هذه النية إلى إعداد مقترح للوكيل.', understood_eyebrow:'ما الذي فهمته', understood_title:'راجع قبل التطبيق', accept:'اعتماد', edit:'تعديل', compare_description:'مقارنة مع الوصف', reset:'إعادة ضبط',
  view_visual:'مرئي', view_configuration:'الإعداد', view_json:'JSON', view_code:'الكود', configuration_title:'إعداد مقروء', configuration_desc:'خريطة واضحة للمخطط الحالي. اختر أي صف للعودة إلى الإعداد المرئي.', json_title:'JSON للمخطط', json_desc:'هذا JSON للتعليم وليس جسم طلب رسمي إلى OpenAI API.', copy_json:'نسخ JSON', code_shortcut_title:'كود SDK المكافئ', code_shortcut_desc:'ينشئ Code Studio مثال Agents SDK متزامناً ويشرح التغيير.', open_code_studio:'فتح Code Studio',
  learn_instructions:'تعلّم: التعليمات', learn_model:'تعلّم: النموذج', learn_tools:'تعلّم: الأدوات والتفويض', learn_mcp:'تعلّم: MCP', learn_guardrails:'تعلّم: ضوابط الحماية', learn_handoff:'تعلّم: التسليم والوكلاء كأدوات', learn_session:'تعلّم: ذاكرة الجلسة', learn_output:'تعلّم: المخرجات المنظمة',
  function_title:'مصمم Function Tool', function_desc:'حدد ما يراه النموذج، والمدخلات التي يمكنه اختيارها، والنتيجة المحلية المستخدمة في المحاكاة.', tool_name:'اسم الأداة', tool_description:'الوصف', arguments:'المدخلات', arguments_desc:'يحدد المخطط المدخلات التي تقبلها الأداة.', add_field:'إضافة حقل', approval_behavior:'الموافقة', approval_never:'أبداً', approval_always:'دائماً', approval_conditional:'مشروطة', approval_rule:'اطلب الموافقة عندما', approval_rule_help:'قاعدة تدريبية بسيطة. إذا تعذر تقييمها، ستطلب المحاكاة الموافقة.', generated_schema:'المخطط المولّد', simulated_result:'نتيجة الأداة المحاكاة', human_description:'وصف بشري', tool_schema:'مخطط الأداة', agent_sees_tool:'الوكيل يرى الأداة', model_args:'النموذج يختار المدخلات', tool_executes:'تنفيذ الأداة', tool_returns:'عودة النتيجة',
  mcp_title:'تدريب إعداد MCP', mcp_desc:'يسمح MCP للوكيل باستخدام أدوات يعرضها خادم. هذه الصفحة تحاكي الاكتشاف فقط.', server_label:'اسم الخادم', transport:'طريقة النقل', server_url:'رابط الخادم', test_connection:'اختبار الاتصال', mcp_not_tested:'لم يتم الاختبار', available_sim_tools:'أدوات محاكاة متاحة',
  tool_guardrail:'ضابط الأداة', tool_guardrail_desc:'فحص Function Tool مخصص قبل التنفيذ أو بعده',
  structured_title:'مصمم Structured Output', structured_desc:'حدد شكل الكائن الذي يجب أن تعيده المحاكاة التدريبية.', structured_output:'مخرجات منظمة',
  compare_training:'تدريب الإعداد', bad_good_title:'إعداد ضعيف مقابل إعداد محسّن', bad_good_desc:'قارن الإعداد الضعيف بإعداد أوضح وشاهد أثره على السلوك والأدوات والتتبع والمخرجات.', bg_instructions:'التعليمات', bg_tool_desc:'وصف الأداة', bg_permissions:'صلاحيات الوكيل', bg_guardrails:'ضوابط الحماية', bg_multiagent:'تصميم متعدد الوكلاء', bg_structured:'المخرجات المنظمة', bg_approval:'إعدادات الموافقة',
  scenario:'السيناريو', scenario_happy:'المسار السليم', scenario_tool_failure:'فشل أداة', scenario_invalid_args:'مدخلات أداة غير صحيحة', scenario_approval_rejected:'رفض الموافقة', scenario_input_block:'حظر ضابط المدخلات', scenario_tool_block:'حظر ضابط الأداة', scenario_output_block:'حظر ضابط المخرجات', scenario_mcp_unavailable:'MCP غير متاح', scenario_structured_failure:'فشل المخرجات المنظمة', scenario_handoff_failure:'فشل التسليم', scenario_help:'كل فشل يغيّر التسلسل والتتبع والمخرج النهائي.',
  input_zone:'المدخل', input_zone_title:'ماذا أرسلت؟', user_prompt:'طلب المستخدم', active_agent:'الوكيل النشط', instructions:'التعليمات', model:'النموذج', tools_available:'الأدوات المتاحة', session_state:'حالة الجلسة', output_zone:'المخرج', output_zone_title:'ماذا عاد؟', run_not_started:'شغّل المحاكاة لرؤية المخرج النهائي للمستخدم.', tools_used:'الأدوات المستخدمة', approval_decisions:'قرارات الموافقة', handoffs:'التسليمات', guardrail_result:'نتيجة الضوابط', run_status:'حالة التشغيل', sim_duration:'المدة المحاكاة',
  what_happened:'ماذا حدث', why_happened:'لماذا حدث', trace_input:'المدخل', trace_output:'المخرج', related_setting:'الإعداد المرتبط', possible_issue:'مشكلة محتملة', inspect_next:'ما الذي تفحصه بعد ذلك', show_in_builder:'عرض في المنشئ',
  build_architecture:'ابنِ تنسيقاً بسيطاً', build_architecture_desc:'أضف عقداً واربطها ثم تحقق من معمارية التدريب.', add_node:'إضافة عقدة', connect:'ربط', explain_architecture:'شرح هذه المعمارية',
  what_changed:'ما الذي تغير؟', explain_code:'شرح الكود المحدد', copy_section:'نسخ القسم', reset_example:'إعادة المثال', configuration_change:'تغيير الإعداد', plain_explanation:'شرح بلغة بسيطة'
};

function captureLabEnglish(){
  document.querySelectorAll('[data-lab]').forEach(function(el){
    if(!el.dataset.labEn) el.dataset.labEn = el.textContent.trim();
  });
}
function translateLab(){
  captureLabEnglish();
  document.querySelectorAll('[data-lab]').forEach(function(el){
    var key=el.dataset.lab;
    if(currentLang==='ar' && labAr[key]!==undefined) el.textContent=labAr[key];
    else if(currentLang==='en' && el.dataset.labEn!==undefined) el.textContent=el.dataset.labEn;
  });
  renderLearnDetails();
  renderDescriptionProposal();
  renderConfigurationViews();
  renderBadGoodTraining();
  renderFunctionSchema();
  renderOutputSchemaPreview();
  renderLearningHome();
  renderGuidedMode();
  renderCustomOrchestration();
  renderTraceTeaching();
}

function upgradeBlueprint(bp){
  bp = bp && typeof bp==='object' ? bp : {};
  var out = {
    name: typeof bp.name==='string' ? bp.name.slice(0,80) : 'Research Agent',
    instructions: typeof bp.instructions==='string' ? bp.instructions.slice(0,6000) : 'Research the request using available tools. Explain uncertainty and return a concise answer.',
    model: ['gpt-6-astra','gpt-5.6-terra','gpt-5.6-luna'].includes(bp.model) ? bp.model : 'gpt-6-astra',
    tools: Array.isArray(bp.tools) ? [...new Set(bp.tools.filter(function(x){return ['web_search','mcp','function','agent_tool'].includes(x);} ))] : ['web_search'],
    guardrails: Array.isArray(bp.guardrails) ? [...new Set(bp.guardrails.filter(function(x){return ['input','output','tool'].includes(x);} ))] : [],
    handoff: ['none','research','support'].includes(bp.handoff) ? bp.handoff : 'none',
    session: typeof bp.session==='boolean' ? bp.session : true,
    output: ['text','structured'].includes(bp.output) ? bp.output : 'text',
    description: typeof bp.description==='string' ? bp.description.slice(0,5000) : LAB_DEFAULTS.description,
    functionTool: labCopy(bp.functionTool || LAB_DEFAULTS.functionTool),
    mcp: labCopy(bp.mcp || LAB_DEFAULTS.mcp),
    outputSchema: labCopy(bp.outputSchema || LAB_DEFAULTS.outputSchema)
  };
  if(!Array.isArray(out.functionTool.args) || !out.functionTool.args.length) out.functionTool.args=labCopy(LAB_DEFAULTS.functionTool.args);
  if(!Array.isArray(out.mcp.availableTools)) out.mcp.availableTools=labCopy(LAB_DEFAULTS.mcp.availableTools);
  if(!out.outputSchema || !Array.isArray(out.outputSchema.fields) || !out.outputSchema.fields.length) out.outputSchema=labCopy(LAB_DEFAULTS.outputSchema);
  return out;
}
var baseSanitizeBlueprintLab = sanitizeBlueprint;
sanitizeBlueprint = function(value){ return upgradeBlueprint(value); };
try { var rawEnhancedBlueprint = JSON.parse(localStorage.getItem('agentlab.blueprint')||'null'); agentBlueprint = upgradeBlueprint(rawEnhancedBlueprint || agentBlueprint); } catch(_) { agentBlueprint = upgradeBlueprint(agentBlueprint); }
saveBlueprint();

function upgradeMastery(){
  try { var rawMastery = JSON.parse(localStorage.getItem('agentlab.mastery')||'{}'); Object.assign(masteryState, rawMastery); } catch(_) {}
  Object.assign(masteryState, {
    draftAccepted: !!masteryState.draftAccepted,
    functionCalled: !!masteryState.functionCalled,
    approvalRuleTriggered: !!masteryState.approvalRuleTriggered,
    approvalResolved: !!masteryState.approvalResolved,
    structuredValidated: !!masteryState.structuredValidated,
    traceFailureIdentified: !!masteryState.traceFailureIdentified,
    debugFixed: !!masteryState.debugFixed,
    codeExplained: !!masteryState.codeExplained
  });
}
upgradeMastery();

Object.assign(i18n.en, {
  subtitle:'Agents SDK Learning Lab · Responses API concepts',
  sim_config_title:'Training Run Setup', sim_config_desc:'Choose the local training inputs used by the simulation.',
  lbl_environment:'Training session mode', quiz_title:'Agents SDK Mastery Challenge', quiz_subtitle:'Test tools, approvals, sessions, handoffs, guardrails, traces and structured outputs.'
});
Object.assign(i18n.ar, {
  subtitle:'مختبر تعليمي لـ Agents SDK ومفاهيم Responses API',
  sim_config_title:'إعداد التشغيل التدريبي', sim_config_desc:'اختر مدخلات التدريب المحلي التي تستخدمها المحاكاة.',
  lbl_environment:'وضع الجلسة التدريبية', quiz_title:'تحدي إتقان Agents SDK', quiz_subtitle:'اختبر فهم الأدوات والموافقات والجلسات والتسليمات والضوابط والتتبع والمخرجات المنظمة.'
});
Object.assign(phase2Text.en, {
  builder_desc:'Describe an agent in plain language, inspect the proposed Blueprint, then edit every capability visually.',
  model_desc:'Choose a current model for this local training Blueprint.',
  tool_web_desc:'Hosted web search tool in the Agents SDK', tool_mcp_desc:'Tools exposed by an MCP server', tool_function_desc:'Local function exposed with a schema', tool_agent_desc:'A specialist Agent exposed as a callable tool',
  guardrails_desc:'Configure checks around input, custom tools, and final output.', session_desc:'Teach how an SDK Session can keep conversation memory across runs.',
  builder_note:'Local training only. No live API, MCP server, external function, approval action, or OpenAI run is executed by this HTML.'
});
Object.assign(phase2Text.ar, {
  builder_desc:'صف الوكيل بلغة عادية، راجع المخطط المقترح، ثم عدّل كل قدرة بصرياً.',
  model_desc:'اختر نموذجاً حالياً لهذا المخطط التدريبي المحلي.',
  tool_web_desc:'أداة Web Search مستضافة في Agents SDK', tool_mcp_desc:'أدوات يعرضها خادم MCP', tool_function_desc:'دالة محلية مع مخطط مدخلات', tool_agent_desc:'وكيل متخصص معروض كأداة قابلة للاستدعاء',
  guardrails_desc:'اضبط فحوصات حول المدخلات والأدوات المخصصة والمخرج النهائي.', session_desc:'تعلّم كيف تحتفظ Session في SDK بذاكرة المحادثة عبر التشغيلات.',
  builder_note:'تدريب محلي فقط. هذا HTML لا يشغّل API أو خادم MCP أو دالة خارجية أو إجراء موافقة أو تشغيل OpenAI فعلياً.'
});
Object.assign(phase3Text.en, {simulator_desc:'See input, simulated execution, tools, approvals, guardrails, handoffs, validation and the final output in one local training run.', status_failed:'Failed'});
Object.assign(phase3Text.ar, {simulator_desc:'شاهد المدخل والتنفيذ المحاكى والأدوات والموافقات والضوابط والتسليم والتحقق والمخرج النهائي ضمن تشغيل تدريبي محلي.', status_failed:'فشل'});
Object.assign(phase45Text.en, {status_failed:'Failed', trace_desc:'Debug the latest local training run. Every span explains what happened, why, and which Builder setting influenced it.', reference_flow:'Agents SDK architecture reference', reference_hint:'Open the simplified SDK flow'});
Object.assign(phase45Text.ar, {status_failed:'فشل', trace_desc:'شخّص آخر تشغيل تدريبي محلي. يشرح كل مقطع ما حدث ولماذا وأي إعداد في المنشئ أثر عليه.', reference_flow:'مرجع معمارية Agents SDK', reference_hint:'افتح مسار SDK المبسط'});
Object.assign(phase67Text.en, {challenge_desc:'Prove competency by configuring and successfully exercising the behavior, not by merely visiting a section.', code_desc:'Generate synchronized Agents SDK examples checked against current official documentation. Conceptual areas stay explicitly labeled.'});
Object.assign(phase67Text.ar, {challenge_desc:'أثبت الكفاءة عبر إعداد السلوك وتجربته بنجاح، وليس بمجرد فتح القسم.', code_desc:'أنشئ أمثلة Agents SDK متزامنة ومراجعة مع التوثيق الرسمي الحالي. تبقى الأجزاء المفاهيمية معنونة بوضوح.'});

modulesData.splice(0, modulesData.length,
  {id:'agents-sdk',title_en:'1. Agents SDK & Responses API',title_ar:'1. Agents SDK و Responses API',desc_en:'Understand the difference between the higher-level agent runtime and the underlying model API.',desc_ar:'افهم الفرق بين تشغيل الوكلاء عالي المستوى وواجهة النموذج الأساسية.',body_en:'<h3>Start with the right mental model</h3><p>The <strong>Agents SDK</strong> gives you Agent, Runner, tools, handoffs, guardrails, sessions, human approval and tracing. The SDK uses the <strong>Responses API</strong> for OpenAI model calls by default. Use the Responses API directly when your application wants to own the orchestration loop itself.</p><div class="grid"><div><span>Agent</span><p>A reusable configuration with instructions, model, tools and optional output type.</p></div><div><span>Runner</span><p>Executes the agent loop, tool calls, handoffs, guardrails and run state.</p></div><div><span>Session</span><p>Provides a memory layer so later runs can continue with conversation history.</p></div><div><span>Trace / Span</span><p>Records execution structure so you can inspect and debug what happened.</p></div></div>',body_ar:'<h3>ابدأ بالنموذج الذهني الصحيح</h3><p>يوفر <strong>Agents SDK</strong> مفاهيم Agent وRunner والأدوات والتسليم والضوابط والجلسات والموافقة البشرية والتتبع. يستخدم SDK <strong>Responses API</strong> افتراضياً لاستدعاءات نماذج OpenAI. استخدم Responses API مباشرة عندما تريد أن يمتلك تطبيقك حلقة التنسيق بنفسه.</p><div class="grid"><div><span>Agent</span><p>إعداد قابل لإعادة الاستخدام يضم التعليمات والنموذج والأدوات ونوع المخرج الاختياري.</p></div><div><span>Runner</span><p>يشغّل حلقة الوكيل واستدعاءات الأدوات والتسليم والضوابط وحالة التشغيل.</p></div><div><span>Session</span><p>طبقة ذاكرة تسمح للتشغيلات التالية بمتابعة سجل المحادثة.</p></div><div><span>Trace / Span</span><p>يسجل بنية التنفيذ حتى تتمكن من الفحص والتشخيص.</p></div></div>'},
  {id:'tools-mcp',title_en:'2. Tools, Function Tools & MCP',title_ar:'2. الأدوات و Function Tools و MCP',desc_en:'Learn what the model sees, what runs locally or remotely, and how results return to the agent.',desc_ar:'تعلّم ما يراه النموذج وما ينفذ محلياً أو عن بعد وكيف تعود النتائج للوكيل.',body_en:'<h3>Tools extend what an Agent can do</h3><p>Hosted OpenAI tools such as Web Search run through the Responses API. A <strong>function tool</strong> exposes your application code with a schema. <strong>MCP</strong> can expose a server’s tools to the Agent. Hosted MCP can be invoked through the model provider; local MCP transports can be connected by the SDK.</p><div class="font-mono"><div>Teaching flow</div><div>Description → schema → model selects arguments → tool executes → result returns → model continues</div></div>',body_ar:'<h3>الأدوات توسع قدرات الوكيل</h3><p>أدوات OpenAI المستضافة مثل Web Search تعمل عبر Responses API. تعرض <strong>Function Tool</strong> كود تطبيقك باستخدام مخطط. ويمكن لـ <strong>MCP</strong> عرض أدوات خادم للوكيل. يمكن تنفيذ Hosted MCP عبر مزود النموذج، بينما يربط SDK وسائل نقل MCP المحلية.</p><div class="font-mono"><div>مسار تعليمي</div><div>الوصف ← المخطط ← اختيار المدخلات ← تنفيذ الأداة ← عودة النتيجة ← متابعة النموذج</div></div>'},
  {id:'orchestration',title_en:'3. Agents as Tools & Handoffs',title_ar:'3. الوكلاء كأدوات والتسليم',desc_en:'Choose between manager-style delegation and transferring control to a specialist.',desc_ar:'اختر بين تفويض بنمط المدير أو نقل التحكم إلى وكيل متخصص.',body_en:'<h3>Two different delegation patterns</h3><p><strong>Agent as tool:</strong> a manager remains in control, calls a specialist as a tool, then synthesizes the final answer. <strong>Handoff:</strong> control transfers to the specialist, which becomes the active agent for the conversation.</p><ul><li>Use an agent as a tool when one owner should synthesize the final response.</li><li>Use a handoff when a specialist should take over the interaction.</li><li>A more complex multi-agent design is not automatically better.</li></ul>',body_ar:'<h3>نمطا تفويض مختلفان</h3><p><strong>الوكيل كأداة:</strong> يبقى المدير مسؤولاً ويستدعي متخصصاً كأداة ثم يدمج الإجابة النهائية. <strong>التسليم:</strong> ينتقل التحكم إلى المتخصص ويصبح هو الوكيل النشط للمحادثة.</p><ul><li>استخدم الوكيل كأداة عندما تريد مالكاً واحداً للمخرج النهائي.</li><li>استخدم التسليم عندما يجب أن يتولى المتخصص التفاعل.</li><li>التصميم الأكثر تعقيداً ليس أفضل تلقائياً.</li></ul>'},
  {id:'approval-trace',title_en:'4. Approval, Guardrails, Structured Output & Tracing',title_ar:'4. الموافقات والضوابط والمخرجات المنظمة والتتبع',desc_en:'See how a run can pause, resume, validate, and expose useful debugging information.',desc_ar:'شاهد كيف يمكن للتشغيل أن يتوقف ويستأنف ويتحقق ويعرض معلومات مفيدة للتشخيص.',body_en:'<h3>Control and inspect the run</h3><p>A tool can require human approval. When approval is needed, the Agents SDK can return interruptions; convert the result to <code>RunState</code>, apply an approve or reject decision, then resume the original run. Guardrails can check input, function-tool calls, and output. Structured output constrains the final result shape. Tracing records spans so you can debug the executed path.</p>',body_ar:'<h3>تحكم في التشغيل وافحصه</h3><p>يمكن للأداة أن تتطلب موافقة بشرية. عند الحاجة للموافقة يستطيع Agents SDK إرجاع interruptions؛ تحوّل النتيجة إلى <code>RunState</code> وتطبق قرار الموافقة أو الرفض ثم تستأنف التشغيل الأصلي. يمكن للضوابط فحص المدخلات واستدعاءات Function Tool والمخرجات. وتحدد Structured Output شكل النتيجة النهائية، بينما يسجل التتبع spans لتشخيص المسار المنفذ.</p>'}
);
quizQuestions.splice(0, quizQuestions.length,
  {id:1,q_en:'What does the Agents SDK add above a direct Responses API loop?',q_ar:'ماذا يضيف Agents SDK فوق حلقة Responses API مباشرة؟',options_en:['A. Only a different model name','B. Agent runtime patterns such as tools, handoffs, guardrails, sessions and tracing','C. A mandatory hosted browser','D. Automatic production deployment'],options_ar:['أ) اسم نموذج مختلف فقط','ب) أنماط تشغيل مثل الأدوات والتسليم والضوابط والجلسات والتتبع','ج) متصفح مستضاف إلزامي','د) نشر إنتاجي تلقائي'],correct:1,explanation_en:'The SDK provides higher-level orchestration primitives around model calls.',explanation_ar:'يوفر SDK مكونات تنسيق عالية المستوى حول استدعاءات النموذج.'},
  {id:2,q_en:'When a function tool requires human approval, what is the documented resume pattern?',q_ar:'عندما تتطلب Function Tool موافقة بشرية، ما نمط الاستئناف الموثق؟',options_en:['A. Start a totally unrelated agent','B. Convert the result to RunState, approve/reject the interruption, then resume with the original top-level Agent','C. Edit the model weights','D. Call an invented /agents/sessions endpoint'],options_ar:['أ) بدء وكيل غير مرتبط','ب) تحويل النتيجة إلى RunState ثم الموافقة/الرفض واستئناف التشغيل بالوكيل الأصلي','ج) تعديل أوزان النموذج','د) استدعاء endpoint غير موثق'],correct:1,explanation_en:'Interruptions can be resolved on RunState and the original run is resumed.',explanation_ar:'يمكن حل المقاطعات على RunState ثم استئناف التشغيل الأصلي.'},
  {id:3,q_en:'What is the difference between a handoff and an agent used as a tool?',q_ar:'ما الفرق بين Handoff واستخدام Agent كأداة؟',options_en:['A. There is no difference','B. Handoff transfers control; agent-as-tool keeps the manager in control','C. Agent-as-tool disables tools','D. Handoffs only work with MCP'],options_ar:['أ) لا فرق','ب) التسليم ينقل التحكم، بينما الوكيل كأداة يبقي المدير مسؤولاً','ج) الوكيل كأداة يعطل الأدوات','د) التسليم يعمل فقط مع MCP'],correct:1,explanation_en:'These are different orchestration choices with different ownership of the final response.',explanation_ar:'هما خياران مختلفان للتنسيق ويختلفان في ملكية الاستجابة النهائية.'},
  {id:4,q_en:'Which label should be used for simplified local JSON that is not an official request body?',q_ar:'أي تسمية يجب استخدامها لـ JSON محلي مبسط ليس جسم طلب رسمي؟',options_en:['A. VERIFIED SDK EXAMPLE','B. PRODUCTION API','C. TRAINING REPRESENTATION','D. LIVE SERVER RESULT'],options_ar:['أ) مثال SDK موثق','ب) API إنتاجي','ج) تمثيل تدريبي','د) نتيجة خادم حي'],correct:2,explanation_en:'Conceptual structures must be clearly labeled as training representations.',explanation_ar:'يجب تسمية البنى المفاهيمية بوضوح على أنها تمثيلات تدريبية.'}
);

var learnTopics = {
  instructions:{en:['What it is','The Agent instructions define its role, goals, boundaries and working behavior.','Why use it','Clear instructions reduce ambiguity about what the Agent should do.','Configuration impact','Sets the Agent instructions field.','Execution effect','The model uses these instructions while deciding how to respond and whether tools are appropriate.'],ar:['ما هو','تحدد تعليمات Agent دوره وأهدافه وحدوده وطريقة عمله.','لماذا تستخدمه','التعليمات الواضحة تقلل الغموض حول المطلوب من الوكيل.','أثر الإعداد','تضبط حقل instructions في Agent.','أثر التنفيذ','يستخدم النموذج التعليمات عند تحديد الاستجابة وما إذا كانت الأدوات مناسبة.']},
  model:{en:['What it is','The model used by the Agent during this training configuration.','Why use it','Different models trade capability, speed and cost.','Configuration impact','Sets the Agent model.','Execution effect','The selected model is shown as the model processing each simulated generation step.'],ar:['ما هو','النموذج الذي يستخدمه Agent ضمن هذا الإعداد التدريبي.','لماذا تستخدمه','تختلف النماذج في القدرات والسرعة والكلفة.','أثر الإعداد','يضبط نموذج Agent.','أثر التنفيذ','يظهر النموذج المختار في خطوات التوليد المحاكاة.']},
  tools:{en:['What it is','Capabilities the model can choose while solving a request.','Why use it','Tools let an Agent search, call application functions, use MCP, or delegate to another Agent.','Configuration impact','Adds tool objects to the Agent.','Execution effect','A tool span can appear when the simulated request needs an enabled capability.'],ar:['ما هي','قدرات يمكن للنموذج اختيارها أثناء حل الطلب.','لماذا تستخدمها','تسمح الأدوات بالبحث واستدعاء وظائف التطبيق واستخدام MCP أو التفويض لوكيل آخر.','أثر الإعداد','تضيف كائنات tools إلى Agent.','أثر التنفيذ','قد يظهر span للأداة عندما يحتاج الطلب المحاكى إلى قدرة مفعلة.']},
  mcp:{en:['What it is','Model Context Protocol lets an Agent discover and use tools exposed by an MCP server.','Why use it','It standardizes access to external tool ecosystems.','Configuration impact','Adds hosted MCP or an SDK-managed MCP server configuration.','Execution effect','A real run may discover/call MCP tools; this standalone page only simulates that behavior.'],ar:['ما هو','يسمح MCP للوكيل باكتشاف أدوات يعرضها خادم MCP واستخدامها.','لماذا تستخدمه','يوحد الوصول إلى منظومات أدوات خارجية.','أثر الإعداد','يضيف Hosted MCP أو إعداد خادم MCP يديره SDK.','أثر التنفيذ','قد يكتشف التشغيل الفعلي أدوات MCP ويستدعيها؛ هذه الصفحة تحاكي ذلك فقط.']},
  guardrails:{en:['What it is','Checks that can allow, block or validate parts of a run.','Why use it','They enforce application policies around input, custom tools and output.','Configuration impact','Adds input/output guardrails or tool guardrails to function tools.','Execution effect','A guardrail span may stop the simulated path before later work happens.'],ar:['ما هي','فحوصات تسمح أو تمنع أو تتحقق من أجزاء التشغيل.','لماذا تستخدمها','تفرض سياسات التطبيق على المدخلات والأدوات المخصصة والمخرجات.','أثر الإعداد','تضيف ضوابط مدخلات/مخرجات أو ضوابط Function Tool.','أثر التنفيذ','قد يوقف span الضابط المسار المحاكى قبل الخطوات اللاحقة.']},
  handoff:{en:['What it is','A handoff transfers control to another Agent; an Agent-as-tool returns work to the manager.','Why use it','Choose the ownership pattern that matches the workflow.','Configuration impact','Adds a handoff target or an Agent tool.','Execution effect','The trace shows either a handoff or a nested specialist tool call.'],ar:['ما هو','ينقل Handoff التحكم لوكيل آخر، بينما Agent-as-tool يعيد العمل للمدير.','لماذا تستخدمه','اختر نمط الملكية المناسب لسير العمل.','أثر الإعداد','يضيف هدف تسليم أو Agent كأداة.','أثر التنفيذ','يظهر التتبع إما تسليماً أو استدعاء أداة لوكيل متخصص.']},
  session:{en:['What it is','A Session is an SDK memory layer that keeps conversation history across runs.','Why use it','It avoids manually rebuilding the full conversation state for each run.','Configuration impact','Passes a Session object to Runner.run.','Execution effect','Later turns can use prior session context. This page persists only local training state.'],ar:['ما هي','Session طبقة ذاكرة في SDK تحفظ سجل المحادثة عبر التشغيلات.','لماذا تستخدمها','تجنب إعادة بناء كل سجل المحادثة يدوياً في كل تشغيل.','أثر الإعداد','تمرر Session إلى Runner.run.','أثر التنفيذ','يمكن للأدوار اللاحقة استخدام سياق الجلسة السابق. هذه الصفحة تحفظ حالة تدريب محلية فقط.']},
  output:{en:['What it is','Structured output asks the Agent to return data matching a defined schema.','Why use it','It makes downstream code easier to validate and consume.','Configuration impact','Sets Agent output_type/outputType in SDK code.','Execution effect','The simulation validates its generated object and visibly fails when the selected failure scenario violates the schema.'],ar:['ما هو','تطلب Structured Output من Agent إعادة بيانات تطابق مخططاً محدداً.','لماذا تستخدمه','يسهل التحقق من البيانات واستخدامها في كود لاحق.','أثر الإعداد','يضبط output_type/outputType في كود SDK.','أثر التنفيذ','تتحقق المحاكاة من الكائن المولد وتعرض فشلاً واضحاً عند مخالفة المخطط.']}
};
function renderLearnDetails(){
  document.querySelectorAll('[data-learn-topic]').forEach(function(root){
    var item=learnTopics[root.dataset.learnTopic]; if(!item)return;
    var a=currentLang==='ar'?item.ar:item.en; root.innerHTML='';
    for(var i=0;i<a.length;i+=2){ var d=document.createElement('div'); d.innerHTML='<span>'+escapeHtml(a[i])+'</span><p>'+escapeHtml(a[i+1]||'')+'</p>'; root.append(d); }
  });
}

function descriptionTemplates(){
  return {
    research: labT('Create a research agent that can search the web, use a documentation MCP server, ask for approval before sensitive actions, and return structured findings.','أنشئ وكيل أبحاث يستطيع البحث في الويب واستخدام خادم MCP للتوثيق وطلب الموافقة قبل الإجراءات الحساسة وإرجاع نتائج منظمة.'),
    support: labT('Create a customer support agent that can look up customer records, hand off complex cases to a support specialist, and never modify customer data without approval.','أنشئ وكيل دعم عملاء يستطيع البحث في سجلات العملاء وتسليم الحالات المعقدة إلى متخصص دعم وألا يعدّل بيانات العميل دون موافقة.'),
    approval: labT('Create an operations agent that can use a function tool, require approval when amount > 5000, validate tool calls, and return summary, risk level, and next action.','أنشئ وكيل عمليات يستطيع استخدام Function Tool ويطلب الموافقة عندما يكون المبلغ أكبر من 5000 ويتحقق من استدعاءات الأدوات ويعيد ملخصاً ومستوى المخاطر والخطوة التالية.')
  };
}
function useStarterDescription(kind){ var el=document.getElementById('agent-description'); if(el){ el.value=descriptionTemplates()[kind]||descriptionTemplates().research; el.focus(); } }

function inferBlueprintFromDescription(text){
  var raw=(text||'').trim(); var low=raw.toLowerCase();
  var wantsWeb=/web|search|research|current|latest|بحث|ويب|أبحاث/.test(low);
  var wantsMcp=/\bmcp\b|documentation|docs|server|توثيق|خادم/.test(low);
  var wantsFunction=/function|database|customer|record|update|modify|action|دال|قاعدة|عميل|سجل|تعديل/.test(low);
  var wantsAgent=/delegate|specialist|agent as tool|subagent|تفويض|متخصص/.test(low);
  var wantsHandoff=/handoff|transfer|take over|تسليم|تحويل/.test(low);
  var wantsApproval=/approval|approve|sensitive|modify|update|amount|موافق|حساس|تعديل|مبلغ/.test(low);
  var wantsGuard=/guardrail|validate|safe|policy|ضابط|تحقق|آمن|سياسة/.test(low);
  var wantsStructured=/structured|schema|json|findings|fields|منظم|مخطط|حقول/.test(low);
  var tools=[]; if(wantsWeb)tools.push('web_search'); if(wantsMcp)tools.push('mcp'); if(wantsFunction||wantsApproval)tools.push('function'); if(wantsAgent)tools.push('agent_tool');
  if(!tools.length) tools.push('web_search');
  var guards=[]; if(wantsGuard){guards.push('input','output'); if(wantsFunction) guards.push('tool');}
  var handoff=wantsHandoff ? (/support|customer|دعم|عميل/.test(low)?'support':'research') : 'none';
  var name=/support|customer|دعم|عميل/.test(low)?'Support Agent':/operation|عمليات/.test(low)?'Operations Agent':'Research Agent';
  var instructions = raw ? ('Fulfill this goal: '+raw+'\nUse only configured tools when useful. Explain uncertainty. Do not claim simulated results are live.') : 'Help the user using the configured capabilities and explain uncertainty.';
  var bp=upgradeBlueprint({
    name:name, description:raw||LAB_DEFAULTS.description, instructions:instructions, model:'gpt-6-astra', tools:tools, guardrails:guards,
    handoff:handoff, session:/memory|session|conversation|ذاكر|جلس/.test(low), output:wantsStructured?'structured':'text',
    functionTool: labCopy(LAB_DEFAULTS.functionTool), mcp:labCopy(LAB_DEFAULTS.mcp), outputSchema:labCopy(LAB_DEFAULTS.outputSchema)
  });
  if(wantsApproval){ bp.functionTool.approval=/amount\s*[>]|مبلغ/.test(low)?'conditional':'always'; bp.functionTool.approvalRule=/amount\s*>\s*([0-9]+)/.test(low)?low.match(/amount\s*>\s*([0-9]+)/)[0]:'amount > 5000'; }
  else bp.functionTool.approval='never';
  return bp;
}
function proposalSummary(bp){
  var toolNames=bp.tools.map(function(t){return ({web_search:'Web Search',mcp:'MCP',function:'Function Tool',agent_tool:'Agent as Tool'})[t]||t;});
  return [
    ['Goal', bp.description||bp.instructions.split('\n')[0]],
    ['Tools needed', toolNames.join(', ')||'None'],
    ['Safety controls', bp.guardrails.length?bp.guardrails.join(', '):((bp.functionTool.approval!=='never')?'Human approval':'None proposed')],
    ['Delegation', bp.handoff!=='none'?'Handoff → '+bp.handoff:(bp.tools.includes('agent_tool')?'Agent as Tool':'Single owner')],
    ['Memory / session', bp.session?'Persistent session concept':'Stateless'],
    ['Expected output', bp.output==='structured'?'Structured object':'Text response']
  ];
}
function renderDescriptionProposal(){
  var root=document.getElementById('description-transform'), dl=document.getElementById('understood-summary'); if(!root||!dl)return;
  if(!labState.proposal){ root.classList.add('hidden'); return; }
  root.classList.remove('hidden'); dl.innerHTML='';
  proposalSummary(labState.proposal).forEach(function(row){var d=document.createElement('div'); d.innerHTML='<dt>'+escapeHtml(row[0])+'</dt><dd>'+escapeHtml(row[1])+'</dd>'; dl.append(d);});
  var compare=document.getElementById('description-compare'); if(compare && !compare.dataset.open) compare.classList.add('hidden');
}
function generateBlueprintFromDescription(){
  var text=(document.getElementById('agent-description')?.value||'').trim(); if(!text) text=descriptionTemplates().research;
  document.getElementById('agent-description').value=text;
  labState.proposal=inferBlueprintFromDescription(text); renderDescriptionProposal();
  document.getElementById('description-transform').scrollIntoView({block:'nearest',behavior:motionBehavior()});
}
function acceptGeneratedBlueprint(){
  if(!labState.proposal)return;
  labState.previousConfig=labCopy(agentBlueprint); agentBlueprint=upgradeBlueprint(labState.proposal); saveBlueprint(); masteryState.draftAccepted=true; saveMastery();
  hydrateBuilder(); renderBlueprint(); syncSimulatorFromBlueprint(); renderConfigurationViews(); generateCode(); refreshMastery(); renderLearningHome();
  showToast(labT('Proposed Blueprint applied locally.','تم تطبيق المخطط المقترح محلياً.'));
}
function editGeneratedBlueprint(){ acceptGeneratedBlueprint(); selectBuilderView('visual'); setTimeout(function(){jumpToBuilderSection('builder-identity');},80); }
function resetDescriptionDraft(){ labState.proposal=null; var el=document.getElementById('agent-description'); if(el)el.value=''; var c=document.getElementById('description-compare'); if(c){c.innerHTML='';c.classList.add('hidden');delete c.dataset.open;} renderDescriptionProposal(); }
function compareDescriptionConfiguration(){
  if(!labState.proposal)return; var root=document.getElementById('description-compare'); root.innerHTML=''; root.dataset.open='1'; root.classList.remove('hidden');
  var rows=[
    [labT('“Search the web / current information”','«ابحث في الويب / معلومات حديثة»'),labState.proposal.tools.includes('web_search')?'Web Search enabled':'Web Search not enabled',labT('Adds a hosted search capability; a search tool span may appear when useful.','يضيف قدرة بحث مستضافة؛ وقد يظهر span لأداة البحث عند الحاجة.')],
    [labT('“Use documentation MCP”','«استخدم MCP للتوثيق»'),labState.proposal.tools.includes('mcp')?'MCP configured':'MCP not configured',labT('Makes MCP tools available in the training Blueprint.','يجعل أدوات MCP متاحة في المخطط التدريبي.')],
    [labT('“Ask for approval”','«اطلب الموافقة»'),labState.proposal.functionTool.approval==='never'?'No approval':('Function approval: '+labState.proposal.functionTool.approval),labT('The simulated run pauses when the approval policy evaluates to required.','يتوقف التشغيل المحاكى عندما تقرر سياسة الموافقة أن الموافقة مطلوبة.')],
    [labT('“Return structured findings”','«أعد نتائج منظمة»'),labState.proposal.output==='structured'?'Structured output':'Text output',labT('The final object is validated against the training schema.','يتم التحقق من الكائن النهائي مقابل المخطط التدريبي.')]
  ];
  rows.forEach(function(r){var d=document.createElement('div'); d.className='mapping-row'; d.innerHTML='<span>'+escapeHtml(r[0])+'</span><b>→</b><span><strong>'+escapeHtml(r[1])+'</strong><small>'+escapeHtml(r[2])+'</small></span>'; root.append(d);});
}

function selectBuilderView(view){
  if(!['visual','configuration','json','code'].includes(view))view='visual'; labState.builderView=view;
  document.querySelectorAll('[data-builder-view-tab]').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.builderViewTab===view));});
  document.querySelectorAll('.builder-visual-surface, .builder-grid').forEach(function(el){el.classList.toggle('hidden',view!=='visual');});
  ['configuration','json','code'].forEach(function(v){var el=document.getElementById('builder-'+v+'-view'); if(el)el.classList.toggle('hidden',v!==view);});
  renderConfigurationViews();
}
function builderMapRows(){
  return [
    ['name',agentBlueprint.name,'builder-identity'],['instructions',agentBlueprint.instructions,'builder-identity'],['model',agentBlueprint.model,'builder-model-card'],
    ['tools',agentBlueprint.tools.join(', ')||'none','builder-tools-card'],['guardrails',agentBlueprint.guardrails.join(', ')||'none','builder-guardrails-card'],
    ['handoff',agentBlueprint.handoff,'builder-orchestration-card'],['session',agentBlueprint.session?'on':'off','builder-runtime-card'],['output',agentBlueprint.output,'builder-output-card']
  ];
}
function trainingConfigObject(){
  return {
    agent:{name:agentBlueprint.name,instructions:agentBlueprint.instructions,model:agentBlueprint.model},
    tools:agentBlueprint.tools.map(function(t){
      if(t==='function')return {type:'function_tool',name:agentBlueprint.functionTool.name,description:agentBlueprint.functionTool.description,parameters:functionSchemaObject(),approval:agentBlueprint.functionTool.approval};
      if(t==='mcp')return {type:'mcp',server_label:agentBlueprint.mcp.serverLabel,transport:agentBlueprint.mcp.transport,server_url:agentBlueprint.mcp.serverUrl,approval:agentBlueprint.mcp.approval};
      if(t==='agent_tool')return {type:'agent_as_tool',specialist:'research_specialist'};
      return {type:t};
    }),
    guardrails:agentBlueprint.guardrails,
    handoff:agentBlueprint.handoff,
    session:{persistent:agentBlueprint.session},
    output:agentBlueprint.output==='structured'?{type:'structured',schema:outputSchemaObject()}:{type:'text'}
  };
}
function renderConfigurationViews(){
  var map=document.getElementById('configuration-map'); if(map){map.innerHTML='';builderMapRows().forEach(function(r){var b=document.createElement('button');b.type='button';b.className='configuration-row';b.innerHTML='<span>'+escapeHtml(r[0])+'</span><strong>'+escapeHtml(r[1])+'</strong>';b.onclick=function(){selectBuilderView('visual');setTimeout(function(){highlightBuilderSection(r[2]);},50);};map.append(b);});}
  var j=document.getElementById('builder-json-output'); if(j)j.textContent=JSON.stringify(trainingConfigObject(),null,2);
  var links=document.getElementById('json-field-links'); if(links){links.innerHTML='';builderMapRows().forEach(function(r){var b=document.createElement('button');b.type='button';b.textContent=r[0];b.onclick=function(){selectBuilderView('visual');setTimeout(function(){highlightBuilderSection(r[2]);},50);};links.append(b);});}
  var cp=document.getElementById('builder-code-preview'); if(cp){try{cp.textContent=generateBlueprintCode('python','agent');}catch(_){cp.textContent=labT('Open Code Studio to generate synchronized code.','افتح Code Studio لإنشاء الكود المتزامن.');}}
}
function highlightBuilderSection(id){var el=document.getElementById(id);if(!el)return;document.querySelectorAll('.builder-card').forEach(function(x){x.classList.remove('is-mapped-highlight');});el.classList.add('is-mapped-highlight');el.scrollIntoView({block:'center',behavior:motionBehavior()});setTimeout(function(){el.classList.remove('is-mapped-highlight');},1600);}
async function copyBuilderJson(){var text=document.getElementById('builder-json-output')?.textContent||'';await copyLabText(text);showToast(labT('JSON copied.','تم نسخ JSON.'));}
async function copyLabText(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch(_){} var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(ta);ta.select();var ok=false;try{ok=document.execCommand('copy');}catch(_){}ta.remove();return ok;}

function functionSchemaObject(){
  var ft=agentBlueprint.functionTool||LAB_DEFAULTS.functionTool, props={}, required=[];
  (ft.args||[]).forEach(function(a){var schema={type:a.type==='number'?'number':a.type==='boolean'?'boolean':a.type==='array'?'array':'string'};if(a.type==='array')schema.items={type:'string'};if(a.example!==''&&a.example!==undefined)schema.example=a.type==='number'?Number(a.example):a.type==='boolean'?String(a.example)==='true':a.example;props[a.name||'field']=schema;if(a.required)required.push(a.name||'field');});
  return {type:'object',properties:props,required:required,additionalProperties:false};
}
function renderFunctionArguments(){
  var root=document.getElementById('function-argument-list');if(!root)return;root.innerHTML='';
  (agentBlueprint.functionTool.args||[]).forEach(function(arg,index){
    var row=document.createElement('div');row.className='designer-row';row.innerHTML='<label class="field"><span>'+labT('Name','الاسم')+'</span><input class="field-control" data-fn-index="'+index+'" data-fn-prop="name" value="'+escapeAttr(arg.name)+'"></label><label class="field"><span>'+labT('Type','النوع')+'</span><select class="field-control" data-fn-index="'+index+'" data-fn-prop="type"><option value="string">string</option><option value="number">number</option><option value="boolean">boolean</option><option value="array">array</option></select></label><label class="mini-check"><input type="checkbox" data-fn-index="'+index+'" data-fn-prop="required" '+(arg.required?'checked':'')+'><span>'+labT('Required','مطلوب')+'</span></label><label class="field"><span>'+labT('Example','مثال')+'</span><input class="field-control" data-fn-index="'+index+'" data-fn-prop="example" value="'+escapeAttr(arg.example??'')+'"></label><button type="button" class="icon-button row-remove" aria-label="'+labT('Remove field','حذف الحقل')+'" data-remove-fn="'+index+'">×</button>';
    row.querySelector('select').value=arg.type||'string';root.append(row);
  });
  root.querySelectorAll('[data-fn-prop]').forEach(function(el){el.addEventListener(el.type==='checkbox'?'change':'input',function(){var i=Number(el.dataset.fnIndex),p=el.dataset.fnProp;agentBlueprint.functionTool.args[i][p]=el.type==='checkbox'?el.checked:el.value;saveBlueprint();renderFunctionSchema();renderConfigurationViews();generateCode();});});
  root.querySelectorAll('[data-remove-fn]').forEach(function(b){b.onclick=function(){agentBlueprint.functionTool.args.splice(Number(b.dataset.removeFn),1);if(!agentBlueprint.functionTool.args.length)agentBlueprint.functionTool.args.push({name:'input',type:'string',required:true,example:'example'});saveBlueprint();renderFunctionArguments();renderFunctionSchema();generateCode();};});
}
function addFunctionArgument(){agentBlueprint.functionTool.args.push({name:'field_'+(agentBlueprint.functionTool.args.length+1),type:'string',required:false,example:''});saveBlueprint();renderFunctionArguments();renderFunctionSchema();}
function renderFunctionSchema(){var el=document.getElementById('function-schema-output');if(el)el.textContent=JSON.stringify({name:agentBlueprint.functionTool?.name||'function_tool',description:agentBlueprint.functionTool?.description||'',parameters:functionSchemaObject()},null,2);}
function renderToolDesignerVisibility(){var f=document.getElementById('function-tool-designer'),m=document.getElementById('mcp-training-card');if(f)f.classList.toggle('hidden',!agentBlueprint.tools.includes('function'));if(m)m.classList.toggle('hidden',!agentBlueprint.tools.includes('mcp'));}
function testMcpConnection(){var result=document.getElementById('mcp-test-result');if(result){result.textContent=labT('Training simulation only. No network connection was made.','محاكاة تدريبية فقط. لم يتم إجراء أي اتصال شبكي.');result.dataset.state='simulated';}var root=document.getElementById('mcp-simulated-tools');if(root){root.innerHTML='';(agentBlueprint.mcp.availableTools||[]).forEach(function(t){var s=document.createElement('span');s.textContent=t;root.append(s);});}showToast(labT('Simulated MCP tools discovered locally.','تمت محاكاة اكتشاف أدوات MCP محلياً.'));}

function outputSchemaObject(){var props={},required=[];(agentBlueprint.outputSchema?.fields||[]).forEach(function(f){var p={type:f.type==='enum'?'string':f.type};if(f.type==='enum')p.enum=['low','medium','high'];if(f.type==='array')p.items={type:'string'};if(f.description)p.description=f.description;props[f.name||'field']=p;if(f.required)required.push(f.name||'field');});return {type:'object',properties:props,required:required,additionalProperties:false};}
function renderOutputFields(){var root=document.getElementById('output-schema-fields');if(!root)return;root.innerHTML='';(agentBlueprint.outputSchema?.fields||[]).forEach(function(field,index){var row=document.createElement('div');row.className='designer-row';row.innerHTML='<label class="field"><span>'+labT('Name','الاسم')+'</span><input class="field-control" data-out-index="'+index+'" data-out-prop="name" value="'+escapeAttr(field.name)+'"></label><label class="field"><span>'+labT('Type','النوع')+'</span><select class="field-control" data-out-index="'+index+'" data-out-prop="type"><option value="string">string</option><option value="array">array</option><option value="number">number</option><option value="boolean">boolean</option><option value="enum">enum</option></select></label><label class="mini-check"><input type="checkbox" data-out-index="'+index+'" data-out-prop="required" '+(field.required?'checked':'')+'><span>'+labT('Required','مطلوب')+'</span></label><label class="field"><span>'+labT('Description','الوصف')+'</span><input class="field-control" data-out-index="'+index+'" data-out-prop="description" value="'+escapeAttr(field.description||'')+'"></label><button type="button" class="icon-button row-remove" aria-label="'+labT('Remove field','حذف الحقل')+'" data-remove-out="'+index+'">×</button>';row.querySelector('select').value=field.type||'string';root.append(row);});
  root.querySelectorAll('[data-out-prop]').forEach(function(el){el.addEventListener(el.type==='checkbox'?'change':'input',function(){var i=Number(el.dataset.outIndex),p=el.dataset.outProp;agentBlueprint.outputSchema.fields[i][p]=el.type==='checkbox'?el.checked:el.value;saveBlueprint();renderOutputSchemaPreview();renderConfigurationViews();generateCode();});});root.querySelectorAll('[data-remove-out]').forEach(function(b){b.onclick=function(){agentBlueprint.outputSchema.fields.splice(Number(b.dataset.removeOut),1);if(!agentBlueprint.outputSchema.fields.length)agentBlueprint.outputSchema.fields.push({name:'result',type:'string',required:true,description:'Result'});saveBlueprint();renderOutputFields();renderOutputSchemaPreview();generateCode();};});}
function addOutputField(){agentBlueprint.outputSchema.fields.push({name:'field_'+(agentBlueprint.outputSchema.fields.length+1),type:'string',required:false,description:''});saveBlueprint();renderOutputFields();renderOutputSchemaPreview();}
function renderOutputSchemaPreview(){var el=document.getElementById('output-schema-preview');if(el)el.textContent=JSON.stringify(outputSchemaObject(),null,2);}
function renderStructuredDesignerVisibility(){var el=document.getElementById('structured-output-designer');if(el)el.classList.toggle('hidden',agentBlueprint.output!=='structured');}

var badGoodExamples={
 instructions:{poor:'Help the user.',good:'You are a customer support agent. Answer account questions using the approved customer database tool. Do not modify customer data without approval.',effect:'Clear scope changes when tools should be used and adds an explicit boundary.'},
 tool_description:{poor:'Customer tool.',good:'Look up a customer account by customer_id and return status and tier. Do not use this tool to modify records.',effect:'A precise tool description helps the model decide when the tool is appropriate.'},
 permissions:{poor:'Use any available tool whenever useful.',good:'Use read-only tools freely. Require approval before any tool that changes external data.',effect:'Narrow permissions reduce unnecessary high-impact calls.'},
 guardrails:{poor:'No validation.',good:'Check unsafe input before the Agent runs and validate sensitive function calls before execution.',effect:'The trace gains explicit checks that can stop risky execution paths.'},
 multiagent:{poor:'Always use three specialist agents.',good:'Use one Agent by default. Delegate only when a specialist has a distinct responsibility or context.',effect:'Simpler workflows reduce coordination overhead and make traces easier to debug.'},
 structured:{poor:'Return JSON.',good:'Return summary:string, sources:array, risk_level:enum, next_action:string.',effect:'An explicit schema makes validation predictable.'},
 approval:{poor:'Never ask for approval.',good:'Require approval for customer updates or when amount > 5000; allow read-only lookup without approval.',effect:'Approval is focused on high-impact actions instead of interrupting every call.'}
};
function renderBadGoodTraining(){var root=document.getElementById('bad-good-content');if(!root)return;var key=document.getElementById('bad-good-topic')?.value||'instructions',x=badGoodExamples[key]||badGoodExamples.instructions;root.innerHTML='<article><span class="eyebrow">'+labT('POOR','ضعيف')+'</span><p>'+escapeHtml(x.poor)+'</p></article><article><span class="eyebrow">'+labT('IMPROVED','محسّن')+'</span><p>'+escapeHtml(x.good)+'</p></article><article class="bad-good-effect"><span class="eyebrow">'+labT('EFFECT','الأثر')+'</span><p>'+escapeHtml(x.effect)+'</p></article>';}

var baseHydrateBuilderLab=hydrateBuilder;
hydrateBuilder=function(){baseHydrateBuilderLab();var bp=upgradeBlueprint(agentBlueprint);var set=function(id,val){var e=document.getElementById(id);if(e)e.value=val??'';};set('function-tool-name',bp.functionTool.name);set('function-tool-description',bp.functionTool.description);set('function-approval-mode',bp.functionTool.approval);set('function-approval-rule',bp.functionTool.approvalRule);set('function-simulated-result',JSON.stringify(bp.functionTool.simulatedResult,null,2));set('mcp-server-label',bp.mcp.serverLabel);set('mcp-transport',bp.mcp.transport);set('mcp-server-url',bp.mcp.serverUrl);set('mcp-approval',bp.mcp.approval);var wrap=document.getElementById('function-approval-rule-wrap');if(wrap)wrap.classList.toggle('hidden',bp.functionTool.approval!=='conditional');var desc=document.getElementById('agent-description');if(desc&&!desc.value)desc.value=bp.description||LAB_DEFAULTS.description;renderFunctionArguments();renderFunctionSchema();renderOutputFields();renderOutputSchemaPreview();renderToolDesignerVisibility();renderStructuredDesignerVisibility();};

var baseSyncBlueprintLab=syncBlueprintFromBuilder;
syncBlueprintFromBuilder=function(){
  var prev=labCopy(agentBlueprint); baseSyncBlueprintLab(); agentBlueprint=upgradeBlueprint(agentBlueprint);
  // The original Builder sync only knows the Phase 2 base fields. Restore extended lab state before reading the enhanced controls so a base-field change cannot erase function schemas, MCP discovery state, or output schemas.
  agentBlueprint.description=prev.description||agentBlueprint.description;
  agentBlueprint.functionTool=labCopy(prev.functionTool||agentBlueprint.functionTool);
  agentBlueprint.mcp=labCopy(prev.mcp||agentBlueprint.mcp);
  agentBlueprint.outputSchema=labCopy(prev.outputSchema||agentBlueprint.outputSchema);
  var val=function(id,fallback){var e=document.getElementById(id);return e?e.value:fallback;};
  agentBlueprint.description=document.getElementById('agent-description')?.value||agentBlueprint.description;
  agentBlueprint.functionTool.name=val('function-tool-name',agentBlueprint.functionTool.name).trim()||'function_tool';agentBlueprint.functionTool.description=val('function-tool-description',agentBlueprint.functionTool.description);agentBlueprint.functionTool.approval=val('function-approval-mode',agentBlueprint.functionTool.approval);agentBlueprint.functionTool.approvalRule=val('function-approval-rule',agentBlueprint.functionTool.approvalRule);agentBlueprint.functionTool.simulatedResult=safeJsonParse(val('function-simulated-result',JSON.stringify(agentBlueprint.functionTool.simulatedResult)),agentBlueprint.functionTool.simulatedResult);
  agentBlueprint.mcp.serverLabel=val('mcp-server-label',agentBlueprint.mcp.serverLabel);agentBlueprint.mcp.transport=val('mcp-transport',agentBlueprint.mcp.transport);agentBlueprint.mcp.serverUrl=val('mcp-server-url',agentBlueprint.mcp.serverUrl);agentBlueprint.mcp.approval=val('mcp-approval',agentBlueprint.mcp.approval);
  saveBlueprint();labState.previousConfig=prev;var wrap=document.getElementById('function-approval-rule-wrap');if(wrap)wrap.classList.toggle('hidden',agentBlueprint.functionTool.approval!=='conditional');renderFunctionSchema();renderToolDesignerVisibility();renderStructuredDesignerVisibility();renderOutputSchemaPreview();renderConfigurationViews();renderLearningHome();
};

var baseRenderBlueprintLab=renderBlueprint;
renderBlueprint=function(){baseRenderBlueprintLab();renderToolDesignerVisibility();renderStructuredDesignerVisibility();renderConfigurationViews();renderLearningHome();};

var baseSyncSimulatorLab=syncSimulatorFromBlueprint;
syncSimulatorFromBlueprint=function(){baseSyncSimulatorLab();var multi=document.getElementById('tool-multiagent');if(multi)multi.checked=agentBlueprint.tools.includes('agent_tool')||agentBlueprint.handoff!=='none';};

var simContext={scenario:'happy',start:0,prompt:'',model:'',sessionMode:'',toolResult:null,usedTools:[],approvals:[],handoffs:[],guardrail:'Not configured',failed:false,failure:null,finalText:'',structured:null,validation:null};
function configuredFunctionArguments(){var obj={};(agentBlueprint.functionTool.args||[]).forEach(function(a){var v=a.example;if(a.type==='number')v=Number(v||0);else if(a.type==='boolean')v=String(v).toLowerCase()==='true';else if(a.type==='array')v=Array.isArray(v)?v:String(v||'').split(',').map(function(x){return x.trim();}).filter(Boolean);obj[a.name||'field']=v;});return obj;}
function approvalRequired(args){var mode=agentBlueprint.functionTool.approval||'never';if(mode==='never')return false;if(mode==='always')return true;var rule=(agentBlueprint.functionTool.approvalRule||'').trim();var m=rule.match(/^([A-Za-z_][\w]*)\s*(>=|<=|>|<|==|=)\s*(-?\d+(?:\.\d+)?)$/);if(!m)return true;var value=args[m[1]];if(typeof value!=='number')return true;var n=Number(m[3]);return ({'>':value>n,'<':value<n,'>=':value>=n,'<=':value<=n,'==':value===n,'=':value===n})[m[2]];}
function stepMeta(setting,why,trigger,disabled){return {setting:setting,why:why,trigger:trigger,disabledEffect:disabled};}
function pushToolUse(name){if(!simContext.usedTools.includes(name))simContext.usedTools.push(name);}
function makeStep(kind,title,description,eventName,data,state,meta){return {kind:kind,title:title,description:description,eventName:eventName,data:data||{},state:state||'complete',meta:meta||{}};}
function functionCallSteps(scenario){
  var out=[],ft=agentBlueprint.functionTool,args=configuredFunctionArguments(),callId='call_'+Math.random().toString(36).slice(2,7),need=approvalRequired(args);
  if(scenario==='invalid_args'){
    var badArgs={unexpected_field:true};out.push(makeStep('tool',labT('Invalid tool arguments','مدخلات أداة غير صحيحة'),labT('The simulated model produced arguments that do not match the configured function schema.','أنتج النموذج المحاكى مدخلات لا تطابق مخطط الدالة.'),'function.arguments.invalid',{tool_name:ft.name,arguments:badArgs,schema:functionSchemaObject()},'failed',stepMeta('Builder → Tools → Function Tool',labT('The selected failure scenario injects a schema mismatch.','يحقن سيناريو الفشل المحدد عدم تطابق في المخطط.'),labT('Invalid Tool Arguments scenario','سيناريو مدخلات غير صحيحة'),labT('With a valid schema call, execution could continue to approval or the tool.','مع استدعاء صحيح يمكن متابعة التنفيذ إلى الموافقة أو الأداة.'))));simContext.failed=true;simContext.failure={title:labT('Invalid tool arguments','مدخلات أداة غير صحيحة'),cause:labT('Arguments did not satisfy the configured function schema.','لم تطابق المدخلات مخطط الدالة.'),inspect:'Builder → Function Tool Designer'};return out;
  }
  if(scenario==='approval_rejected'){
    out.push(makeStep('approval',labT('Approval rejected','تم رفض الموافقة'),labT('The training scenario simulates a reviewer rejecting this sensitive tool call, so the function does not execute.','يحاكي السيناريو رفض المراجع لاستدعاء الأداة الحساسة، لذلك لا تنفذ الدالة.'),'approval.rejected',{tool_name:ft.name,call_id:callId,arguments:args,decision:'rejected'},'rejected',stepMeta('Builder → Tools → Function Tool → Approval',labT('The Approval Rejected scenario injects a human rejection decision.','يحقن سيناريو رفض الموافقة قرار رفض بشري.'),labT('Approval Rejected scenario','سيناريو رفض الموافقة'),labT('If approved, the function could execute and return a result.','لو تمت الموافقة يمكن للدالة التنفيذ وإعادة نتيجة.'))));
    simContext.approvals.push('Rejected by training scenario');simContext.failed=true;simContext.failure={title:labT('Approval rejected','تم رفض الموافقة'),cause:labT('A simulated reviewer rejected the tool call.','رفض مراجع محاكى استدعاء الأداة.'),inspect:'Builder → Function Tool Approval / Trace'};return out;
  }
  if(need){masteryState.approvalRuleTriggered=ft.approval==='conditional';saveMastery();out.push({kind:'approval',title:labT('Tool approval required','الأداة تحتاج موافقة'),description:ft.approval==='conditional'?labT('The conditional approval rule evaluated to required.','تم تقييم قاعدة الموافقة المشروطة على أنها مطلوبة.'):labT('This function tool is configured to always require approval.','تم إعداد هذه Function Tool لتتطلب الموافقة دائماً.'),eventName:'approval.interruption',requiresApproval:true,data:{type:'ToolApprovalItem',agent_name:agentBlueprint.name,tool_name:ft.name,call_id:callId,arguments:args,approval_policy:ft.approval,rule:ft.approvalRule},meta:stepMeta('Builder → Tools → Function Tool → Approval',labT('The approval policy requires a human decision before tool execution.','تتطلب سياسة الموافقة قراراً بشرياً قبل تنفيذ الأداة.'),ft.approval==='conditional'?ft.approvalRule:'Always',labT('With approval set to Never, the tool would proceed without this interruption.','عند ضبط الموافقة على Never ستتابع الأداة دون هذه المقاطعة.'))});
  }
  if(scenario==='tool_block'){
    out.push(Object.assign(makeStep('guardrail',labT('Tool guardrail blocked call','ضابط الأداة حظر الاستدعاء'),labT('The simulated function-tool input guardrail blocked the call before execution.','حظر ضابط مدخل Function Tool المحاكى الاستدعاء قبل التنفيذ.'),'tool_guardrail.blocked',{tool_name:ft.name,arguments:args},'failed',stepMeta('Builder → Guardrails → Tool guardrail',labT('The Tool Guardrail Block scenario triggered the configured tool check.','شغّل سيناريو حظر الأداة الفحص المعدّ.'),labT('Tool Guardrail Block scenario','سيناريو حظر ضابط الأداة'),labT('Without this tool guardrail, the approved call would execute.','بدون ضابط الأداة سينفذ الاستدعاء الموافق عليه.'))),{requiresApproved:need}));simContext.failed=true;simContext.failure={title:labT('Tool guardrail blocked the call','ضابط الأداة حظر الاستدعاء'),cause:labT('A simulated tool input guardrail rejected the function call.','رفض ضابط مدخل أداة محاكى استدعاء الدالة.'),inspect:'Builder → Guardrails'};return out;
  }
  if(scenario==='tool_failure'){
    out.push(Object.assign(makeStep('tool',labT('Function tool failed','فشلت Function Tool'),labT('The function was called, but the simulated application returned an execution error.','تم استدعاء الدالة لكن التطبيق المحاكى أعاد خطأ تنفيذ.'),'function.failed',{tool_name:ft.name,call_id:callId,error:'Simulated upstream database timeout'},'failed',stepMeta('Builder → Tools → Function Tool',labT('The Tool Failure scenario injects an execution error after the call.','يحقن سيناريو فشل الأداة خطأ تنفيذ بعد الاستدعاء.'),labT('Tool Failure scenario','سيناريو فشل الأداة'),labT('A successful tool result would be returned to the Agent for synthesis.','في النجاح ستعود نتيجة الأداة إلى Agent للدمج.'))),{requiresApproved:need}));simContext.failed=true;simContext.failure={title:labT('Function tool failure','فشل Function Tool'),cause:labT('The simulated application tool returned an error.','أعادت أداة التطبيق المحاكاة خطأ.'),inspect:'Trace → failed tool span'};return out;
  }
  var result=labCopy(ft.simulatedResult||{});
  out.push(Object.assign(makeStep('tool',labT('Function tool completed','اكتملت Function Tool'),labT('The local simulated result returned to the Agent and can influence the final response.','عادت النتيجة المحلية المحاكاة إلى Agent ويمكن أن تؤثر على الاستجابة النهائية.'),'function.completed',{tool_name:ft.name,call_id:callId,arguments:args,output:result},'complete',stepMeta('Builder → Tools → Function Tool',labT('The function capability is enabled and the request benefits from its configured data.','قدرة الدالة مفعلة ويستفيد الطلب من بياناتها المعدّة.'),labT('Function tool enabled','Function Tool مفعلة'),labT('If the Function Tool were disabled, this result would not be available to the final response.','إذا عُطلت Function Tool فلن تكون هذه النتيجة متاحة للمخرج النهائي.'))),{requiresApproved:need}));
  return out;
}
function buildSimulationQueue(prompt,model,sessionMode){
  var scenario=document.getElementById('sim-scenario')?.value||'happy';simContext.scenario=scenario;var q=[];
  q.push(makeStep('user',labT('User input','مدخل المستخدم'),prompt,'run.input.received',{content:prompt},'complete',stepMeta('Simulator → User prompt',labT('Every run starts with the user input.','يبدأ كل تشغيل بمدخل المستخدم.'),labT('Run started','بدأ التشغيل'),labT('Changing the prompt changes what the Agent needs to do.','تغيير الطلب يغير ما يحتاج Agent إلى فعله.'))));
  if(scenario==='input_block'){
    q.push(makeStep('guardrail',labT('Input guardrail blocked run','ضابط المدخلات حظر التشغيل'),labT('The simulated input check stopped the run before the Agent generated a response.','أوقف فحص المدخلات المحاكى التشغيل قبل أن يولد Agent استجابة.'),'input_guardrail.blocked',{guardrail:'input',result:'blocked'},'failed',stepMeta('Builder → Guardrails → Input guardrail',labT('The selected scenario triggered an input policy failure.','شغّل السيناريو المحدد فشل سياسة المدخلات.'),labT('Input Guardrail Block scenario','سيناريو حظر المدخلات'),labT('Without an input guardrail, the Agent would continue to model generation.','بدون ضابط المدخلات سيستمر Agent إلى توليد النموذج.'))));simContext.guardrail='Input blocked';simContext.failed=true;simContext.failure={title:labT('Input blocked','تم حظر المدخل'),cause:labT('The simulated input guardrail rejected the request.','رفض ضابط المدخلات المحاكى الطلب.'),inspect:'Builder → Guardrails'};return q;
  }
  q.push(makeStep('agent',labT('Model generation','توليد النموذج'),labT('The Agent received its instructions, model, tools, and current session context, then decided what capability to use.','استلم Agent تعليماته والنموذج والأدوات وسياق الجلسة ثم قرر القدرة المناسبة.'),'agent.generation',{agent_name:agentBlueprint.name,model:model,instructions:agentBlueprint.instructions},'complete',stepMeta('Builder → Instructions / Model',labT('The Agent must interpret the request before selecting tools or producing output.','يجب أن يفسر Agent الطلب قبل اختيار الأدوات أو إنتاج المخرج.'),labT('User input received','تم استلام مدخل المستخدم'),labT('Different instructions or tools can change the next step.','يمكن لتعليمات أو أدوات مختلفة أن تغير الخطوة التالية.'))));
  if(agentBlueprint.guardrails.includes('input')){q.splice(1,0,makeStep('guardrail',labT('Input guardrail passed','اجتاز ضابط المدخلات'),labT('The configured input check allowed the request to continue.','سمح فحص المدخلات المعدّ باستمرار الطلب.'),'input_guardrail.passed',{guardrail:'input',result:'passed'},'complete',stepMeta('Builder → Guardrails → Input guardrail',labT('An input guardrail is enabled in the Blueprint.','ضابط المدخلات مفعل في المخطط.'),labT('Input received','تم استلام المدخل'),labT('With it disabled, the run would skip this check.','عند تعطيله سيتجاوز التشغيل هذا الفحص.'))));simContext.guardrail='Input passed';}
  if(document.getElementById('tool-websearch')?.checked){pushToolUse('web_search');q.push(makeStep('tool',labT('Web Search called','تم استدعاء Web Search'),labT('The simulated request benefits from current public information, so the enabled hosted Web Search capability was selected.','يستفيد الطلب المحاكى من معلومات عامة حديثة لذلك تم اختيار Web Search المفعلة.'),'web_search.completed',{query:'current information for: '+prompt.slice(0,80),result:'Simulated public search findings'},'complete',stepMeta('Builder → Tools → Web Search',labT('Web Search is enabled and the training request is research-oriented.','Web Search مفعلة والطلب التدريبي بحثي.'),labT('Current information needed','الحاجة لمعلومات حديثة'),labT('If disabled, the Agent would answer without retrieving current public information.','إذا عُطلت فسيجيب Agent دون جلب معلومات عامة حديثة.'))));}
  if(document.getElementById('tool-mcp')?.checked){pushToolUse('MCP');if(scenario==='mcp_unavailable'){q.push(makeStep('tool',labT('MCP unavailable','MCP غير متاح'),labT('The simulated MCP server could not be reached. The Agent falls back to other available information.','تعذر الوصول إلى خادم MCP المحاكى، لذلك يعود Agent إلى المعلومات الأخرى المتاحة.'),'mcp.failed',{server_label:agentBlueprint.mcp.serverLabel,error:'Simulated connection unavailable'},'failed',stepMeta('Builder → Tools → MCP',labT('The MCP Unavailable scenario injects a connection failure.','يحقن سيناريو MCP غير متاح فشل اتصال.'),labT('MCP Unavailable scenario','سيناريو MCP غير متاح'),labT('A reachable MCP server would expose tools and allow an MCP tool call.','الخادم المتاح سيعرض الأدوات ويسمح باستدعاء MCP.'))));simContext.failed=true;simContext.failure={title:labT('MCP unavailable','MCP غير متاح'),cause:labT('The simulated MCP connection failed.','فشل اتصال MCP المحاكى.'),inspect:'Builder → MCP Configuration / Trace'};}else{q.push(makeStep('tool',labT('MCP tool called','تم استدعاء أداة MCP'),labT('A simulated documentation tool returned supporting context. No network request was made by this HTML.','أعادت أداة توثيق محاكاة سياقاً داعماً. لم ينفذ هذا HTML أي طلب شبكة.'),'mcp.completed',{server_label:agentBlueprint.mcp.serverLabel,tool:'search_docs',result:'Simulated documentation context'},'complete',stepMeta('Builder → Tools → MCP',labT('MCP is enabled in the Blueprint.','MCP مفعل في المخطط.'),labT('Supporting documentation needed','الحاجة إلى توثيق داعم'),labT('If MCP were disabled, no MCP tool would be available.','إذا عُطل MCP فلن تتوفر أداة MCP.'))));}}
  if(scenario==='mcp_unavailable'&&!document.getElementById('tool-mcp')?.checked){q.push(makeStep('tool',labT('MCP unavailable','MCP غير متاح'),labT('This scenario cannot use MCP because the capability is not enabled in the current Blueprint.','لا يستطيع هذا السيناريو استخدام MCP لأن القدرة غير مفعلة في المخطط الحالي.'),'mcp.unavailable.not_configured',{configured:false},'failed',stepMeta('Builder → Tools → MCP',labT('The failure scenario requires MCP, but MCP is disabled.','يتطلب سيناريو الفشل MCP لكنه معطل.'),labT('MCP Unavailable scenario','سيناريو MCP غير متاح'),labT('Enable MCP to simulate a configured server becoming unavailable.','فعّل MCP لمحاكاة تعذر خادم معدّ.'))));simContext.failed=true;simContext.failure={title:labT('MCP unavailable','MCP غير متاح'),cause:labT('MCP is not configured in the current Blueprint.','MCP غير معد في المخطط الحالي.'),inspect:'Builder → MCP Configuration'};}
  if(agentBlueprint.handoff!=='none'||document.getElementById('tool-multiagent')?.checked){var isHandoff=agentBlueprint.handoff!=='none';if(scenario==='handoff_failure'){q.push(makeStep('handoff',labT('Handoff failed','فشل التسليم'),labT('The simulated specialist was unavailable, so control could not transfer.','لم يكن المتخصص المحاكى متاحاً لذلك تعذر نقل التحكم.'),'handoff.failed',{target:agentBlueprint.handoff||'Research specialist'},'failed',stepMeta('Builder → Handoffs',labT('The Handoff Failure scenario makes the specialist unavailable.','يجعل سيناريو فشل التسليم المتخصص غير متاح.'),labT('Handoff selected','تم اختيار التسليم'),labT('With a valid specialist, control would transfer and the specialist would continue.','مع متخصص صالح سينتقل التحكم ويتابع المتخصص.'))));simContext.failed=true;simContext.failure={title:labT('Handoff failure','فشل التسليم'),cause:labT('The simulated specialist was unavailable.','لم يكن المتخصص المحاكى متاحاً.'),inspect:'Builder → Handoffs'};}else{var specialist=agentBlueprint.handoff==='support'?'Support specialist':'Research specialist';simContext.handoffs.push(isHandoff?'Handoff → '+specialist:'Agent as Tool → '+specialist);q.push(makeStep('handoff',isHandoff?labT('Handoff to specialist','تسليم إلى متخصص'):labT('Specialist Agent used as tool','استخدام Agent متخصص كأداة'),isHandoff?labT('Control transferred to the configured specialist.','انتقل التحكم إلى المتخصص المعدّ.'):labT('The manager kept control while a specialist Agent returned a focused result.','احتفظ المدير بالتحكم بينما أعاد Agent متخصص نتيجة مركزة.'),isHandoff?'handoff.completed':'agent_tool.completed',{specialist:specialist,pattern:isHandoff?'handoff':'agent_as_tool'},'complete',stepMeta(isHandoff?'Builder → Handoffs':'Builder → Tools → Agent as Tool',labT('The Blueprint includes a delegation capability.','يتضمن المخطط قدرة تفويض.'),labT('Delegation judged useful','اعتُبر التفويض مفيداً'),labT('Without delegation, one Agent would own the entire request.','بدون التفويض سيتولى Agent واحد كامل الطلب.'))));}}
  if(scenario==='handoff_failure'&&agentBlueprint.handoff==='none'&&!document.getElementById('tool-multiagent')?.checked){q.push(makeStep('handoff',labT('Handoff failed','فشل التسليم'),labT('No specialist handoff or Agent-as-Tool route is configured, so the simulated delegation cannot occur.','لا يوجد تسليم لمتخصص أو مسار Agent-as-Tool معد، لذلك لا يمكن تنفيذ التفويض المحاكى.'),'handoff.not_configured',{configured:false},'failed',stepMeta('Builder → Handoffs / Agent as Tool',labT('The Handoff Failure scenario requires a delegation route.','يتطلب سيناريو فشل التسليم مسار تفويض.'),labT('Handoff Failure scenario','سيناريو فشل التسليم'),labT('Configure a handoff or Agent as Tool to simulate a configured specialist failing.','أعد تسليماً أو Agent كأداة لمحاكاة فشل متخصص معد.'))));simContext.failed=true;simContext.failure={title:labT('Handoff failure','فشل التسليم'),cause:labT('No delegation route is configured in the current Blueprint.','لا يوجد مسار تفويض معد في المخطط الحالي.'),inspect:'Builder → Handoffs / Tools'};}
  if(document.getElementById('tool-functions')?.checked){functionCallSteps(scenario).forEach(function(s){q.push(s);});}
  else if(['tool_failure','invalid_args','tool_block','approval_rejected'].includes(scenario)){q.push(makeStep('tool',labT('Function capability unavailable','قدرة Function Tool غير متاحة'),labT('This failure scenario needs a Function Tool, but the current Blueprint has none enabled.','يحتاج سيناريو الفشل إلى Function Tool لكنها غير مفعلة في المخطط الحالي.'),'function.not_configured',{scenario:scenario},'failed',stepMeta('Builder → Tools → Function Tool',labT('The selected failure scenario depends on a function capability.','يعتمد سيناريو الفشل المحدد على قدرة Function Tool.'),labT('Failure scenario selected','تم اختيار سيناريو فشل'),labT('Enable a Function Tool to test its configured schema, approval, guardrail, or execution failure.','فعّل Function Tool لاختبار مخططها أو موافقتها أو ضابطها أو فشل التنفيذ.'))));simContext.failed=true;simContext.failure={title:labT('Function capability unavailable','قدرة Function Tool غير متاحة'),cause:labT('No Function Tool is enabled in the current Blueprint.','لا توجد Function Tool مفعلة في المخطط الحالي.'),inspect:'Builder → Function Tool Designer'};}
  if(scenario==='output_block'){
    q.push(makeStep('guardrail',labT('Output guardrail blocked draft','ضابط المخرجات حظر المسودة'),labT('The draft response failed the simulated output policy and was not released to the user.','فشلت مسودة الاستجابة في سياسة المخرجات المحاكاة ولم تصل للمستخدم.'),'output_guardrail.blocked',{guardrail:'output',result:'blocked'},'failed',stepMeta('Builder → Guardrails → Output guardrail',labT('The Output Guardrail Block scenario triggered the final policy check.','شغّل سيناريو حظر المخرجات الفحص النهائي.'),labT('Draft response produced','تم إنتاج مسودة'),labT('Without the output guardrail, the draft would reach structured validation or the user.','بدون ضابط المخرجات ستصل المسودة إلى التحقق المنظم أو المستخدم.'))));simContext.guardrail='Output blocked';simContext.failed=true;simContext.failure={title:labT('Output blocked','تم حظر المخرج'),cause:labT('The simulated output guardrail rejected the draft.','رفض ضابط المخرجات المحاكى المسودة.'),inspect:'Builder → Guardrails'};return q;
  }
  if(agentBlueprint.guardrails.includes('output')){q.push(makeStep('guardrail',labT('Output guardrail passed','اجتاز ضابط المخرجات'),labT('The configured output check allowed the draft to continue.','سمح فحص المخرجات المعدّ باستمرار المسودة.'),'output_guardrail.passed',{guardrail:'output',result:'passed'},'complete',stepMeta('Builder → Guardrails → Output guardrail',labT('An output guardrail is enabled.','ضابط المخرجات مفعل.'),labT('Draft response produced','تم إنتاج مسودة'),labT('If disabled, the run would skip this final policy check.','عند تعطيله سيتجاوز التشغيل هذا الفحص النهائي.'))));simContext.guardrail=simContext.guardrail==='Not configured'?'Output passed':simContext.guardrail+', output passed';}
  if(agentBlueprint.output==='structured'){
    var validity=scenario==='structured_failure'?'failed':'passed';q.push(makeStep('guardrail',validity==='passed'?labT('Structured output validated','تم التحقق من المخرج المنظم'):labT('Structured output validation failed','فشل التحقق من المخرج المنظم'),validity==='passed'?labT('The simulated final object matches the selected training schema.','يطابق الكائن النهائي المحاكى المخطط التدريبي المحدد.'):labT('The simulated output intentionally violates the selected training schema.','يخالف المخرج المحاكى المخطط التدريبي المحدد عمداً.'),'structured.validation.'+validity,{schema:outputSchemaObject(),result:validity},validity==='passed'?'complete':'failed',stepMeta('Builder → Output → Structured Output Designer',labT('Structured output is enabled, so the final object must match its schema.','المخرجات المنظمة مفعلة لذلك يجب أن يطابق الكائن النهائي المخطط.'),labT('Final draft ready','المسودة النهائية جاهزة'),labT('With text output, this schema validation step would not run.','مع المخرج النصي لن تعمل خطوة التحقق هذه.'))));if(validity==='failed'){simContext.failed=true;simContext.failure={title:labT('Structured output validation failed','فشل التحقق من المخرجات المنظمة'),cause:labT('The training scenario produced an object that does not satisfy the selected schema.','أنتج سيناريو التدريب كائناً لا يطابق المخطط المحدد.'),inspect:'Builder → Structured Output Designer'};}}
  if(scenario==='structured_failure'&&agentBlueprint.output!=='structured'){q.push(makeStep('guardrail',labT('Structured output validation failed','فشل التحقق من المخرج المنظم'),labT('The scenario requested structured validation, but the Blueprint is configured for text output and has no active output schema.','طلب السيناريو تحققاً منظماً لكن المخطط معد للمخرج النصي ولا يوجد مخطط إخراج فعال.'),'structured.validation.not_configured',{output_type:agentBlueprint.output,configured:false},'failed',stepMeta('Builder → Output',labT('Structured Output Failure requires a structured output schema.','يتطلب سيناريو فشل المخرجات المنظمة مخطط مخرج منظم.'),labT('Structured Output Failure scenario','سيناريو فشل المخرجات المنظمة'),labT('Enable Structured Output and define a schema to validate a generated object.','فعّل Structured Output وحدد مخططاً للتحقق من الكائن المولد.'))));simContext.failed=true;simContext.failure={title:labT('Structured output validation failed','فشل التحقق من المخرجات المنظمة'),cause:labT('Structured Output is not enabled in the current Blueprint.','Structured Output غير مفعلة في المخطط الحالي.'),inspect:'Builder → Output'};}
  q.push(makeStep('final',labT('Final response ready','الاستجابة النهائية جاهزة'),labT('The simulated Agent synthesized the available results into the final user-facing output.','دمج Agent المحاكى النتائج المتاحة في المخرج النهائي للمستخدم.'),'run.output.ready',{output_type:agentBlueprint.output},simContext.failed?'failed':'complete',stepMeta('Builder → Instructions / Output',labT('The run reached the final response stage using the results that were actually available.','وصل التشغيل إلى مرحلة الاستجابة النهائية باستخدام النتائج المتاحة فعلياً.'),labT('Execution path completed','اكتمل مسار التنفيذ'),labT('Changing tools, approvals, guardrails, handoffs or output schema changes what can reach this stage.','تغيير الأدوات أو الموافقات أو الضوابط أو التسليم أو مخطط المخرج يغيّر ما يصل إلى هذه المرحلة.'))));
  return q;
}

function renderSimulationInput(){var root=document.getElementById('simulation-input-summary');if(!root)return;var values=[simContext.prompt,agentBlueprint.name,agentBlueprint.instructions,simContext.model,agentBlueprint.tools.join(', ')||labT('None','لا يوجد'),agentBlueprint.session?labT('Persistent Session concept enabled','مفهوم Session مستمرة مفعل'):labT('Stateless','بدون حالة')];root.querySelectorAll('dd').forEach(function(dd,i){dd.textContent=values[i]??'—';});}
function buildStructuredOutput(invalid){var result={};var sourceList=simContext.usedTools.map(function(x){return x+' (simulated)';});(agentBlueprint.outputSchema?.fields||[]).forEach(function(f,index){if(invalid&&index===0)return;var val;if(f.type==='array')val=sourceList.length?sourceList:['simulation'];else if(f.type==='number')val=1;else if(f.type==='boolean')val=true;else if(f.type==='enum')val='low';else if(/summary/i.test(f.name))val=composeFinalText();else if(/next/i.test(f.name))val=simContext.failed?'Inspect the failed trace span':'Review the findings';else val=simContext.toolResult?.[f.name]??('Simulated '+f.name);result[f.name]=val;});if(invalid){var first=agentBlueprint.outputSchema?.fields?.[0];if(first)result[first.name]=42;}return result;}
function validateStructuredObject(obj){var fields=agentBlueprint.outputSchema?.fields||[];var errors=[];fields.forEach(function(f){if(f.required&&!(f.name in obj))errors.push(f.name+' is required');if(f.name in obj){var v=obj[f.name];if(f.type==='string'&&typeof v!=='string')errors.push(f.name+' must be string');if(f.type==='array'&&!Array.isArray(v))errors.push(f.name+' must be array');if(f.type==='number'&&typeof v!=='number')errors.push(f.name+' must be number');if(f.type==='boolean'&&typeof v!=='boolean')errors.push(f.name+' must be boolean');if(f.type==='enum'&&!['low','medium','high'].includes(v))errors.push(f.name+' must be low, medium, or high');}});return {valid:!errors.length,errors:errors};}
function composeFinalText(){
  if(simContext.scenario==='input_block')return labT('I cannot continue because the training input guardrail blocked this request.','لا يمكنني المتابعة لأن ضابط المدخلات التدريبي حظر هذا الطلب.');
  if(simContext.scenario==='output_block')return labT('No user-facing answer was released because the training output guardrail blocked the draft.','لم يتم إصدار إجابة للمستخدم لأن ضابط المخرجات التدريبي حظر المسودة.');
  var parts=[];if(simContext.toolResult){var r=simContext.toolResult;parts.push(labT('The simulated function returned','أعادت الدالة المحاكاة')+' '+Object.entries(r).slice(0,3).map(function(x){return x[0]+'='+String(x[1]);}).join(', ')+'.');}
  if(simContext.usedTools.includes('web_search'))parts.push(labT('Simulated web findings were included.','تم تضمين نتائج ويب محاكاة.'));if(simContext.usedTools.includes('MCP'))parts.push(labT('Simulated MCP documentation context was considered.','تمت مراعاة سياق توثيق MCP المحاكى.'));if(simContext.handoffs.length)parts.push(simContext.handoffs.join('; ')+'.');
  if(simContext.failed&&simContext.failure)parts.push(labT('The run continued with a limitation: ','تابع التشغيل مع قيد: ')+simContext.failure.title+'.');
  return parts.join(' ')||labT('The simulated Agent completed the request using only its configured local training capabilities.','أكمل Agent المحاكى الطلب باستخدام قدرات التدريب المحلية المعدّة فقط.');
}
function renderSimulationOutput(){
  var final=document.getElementById('final-user-output'),box=document.getElementById('structured-output-box'),pre=document.getElementById('structured-output-value'),badge=document.getElementById('output-validation-badge');if(!final)return;
  simContext.finalText=composeFinalText();final.textContent=simContext.finalText;
  if(agentBlueprint.output==='structured'){var obj=buildStructuredOutput(simContext.scenario==='structured_failure'),val=validateStructuredObject(obj);simContext.structured=obj;simContext.validation=val;box.classList.remove('hidden');pre.textContent=JSON.stringify(obj,null,2);badge.textContent=val.valid?labT('VALID TRAINING OUTPUT','مخرج تدريبي صالح'):labT('STRUCTURED OUTPUT VALIDATION FAILED','فشل التحقق من المخرج المنظم');badge.className='accuracy-badge '+(val.valid?'verified':'simulation');if(val.valid && ['completed','rejected','failed'].includes(simulationState.status)){masteryState.structuredValidated=true;saveMastery();}}
  else{box.classList.add('hidden');badge.textContent=labT('TRAINING REPRESENTATION','تمثيل تدريبي');badge.className='accuracy-badge training';}
  var values=[simContext.usedTools.join(', ')||labT('None','لا يوجد'),simContext.approvals.join(', ')||labT('None','لا يوجد'),simContext.handoffs.join(', ')||labT('None','لا يوجد'),simContext.guardrail,simulationStatusText(),Math.max(1,simulationState.timeline.length*170)+' ms'];document.getElementById('simulation-output-summary')?.querySelectorAll('dd').forEach(function(dd,i){dd.textContent=values[i]??'—';});
  var rc=document.getElementById('simulation-root-cause');if(simContext.failure){rc.classList.remove('hidden');rc.innerHTML='<strong>'+escapeHtml(simContext.failure.title)+'</strong><p>'+escapeHtml(simContext.failure.cause)+'</p><small>'+escapeHtml(labT('Inspect: ','افحص: ')+simContext.failure.inspect)+'</small>';}else{rc.classList.add('hidden');rc.innerHTML='';}
}

function runSimulation(){
  clearSimulationState(false);simContext={scenario:document.getElementById('sim-scenario')?.value||'happy',start:Date.now(),prompt:(document.getElementById('sim-prompt')?.value||'').trim()||'Run the configured agent.',model:document.getElementById('sim-model')?.value||agentBlueprint.model,sessionMode:document.getElementById('sim-environment')?.value||'local_memory',toolResult:null,usedTools:[],approvals:[],handoffs:[],guardrail:'Not configured',failed:false,failure:null,finalText:'',structured:null,validation:null};
  var sessId='sim_'+Math.random().toString(36).slice(2,9);simulationState.sessionId=sessId;simulationState.queue=buildSimulationQueue(simContext.prompt,simContext.model,simContext.sessionMode);simulationState.cursor=0;simulationState.decision=null;document.getElementById('session-id-display').textContent=sessId;document.getElementById('sim-run-agent').textContent=agentBlueprint.name;document.getElementById('sim-run-model').textContent=simContext.model;renderSimulationInput();var finalBox=document.getElementById('final-user-output');if(finalBox)finalBox.textContent=labT('Run in progress…','التشغيل قيد التنفيذ…');setSimulationStatus('running');appendSimLog('run.started',{simulation:true,session_id:sessId,agent_name:agentBlueprint.name,model:simContext.model,scenario:simContext.scenario,queue_length:simulationState.queue.length});if(window.matchMedia('(max-width:1023px)').matches)document.getElementById('stream-panel').scrollIntoView({block:'start',behavior:motionBehavior()});scheduleSimulationStep(120);
}
function resolveSimulationApproval(decision){
  var pending=simulationState.pendingApproval;if(!pending||!['approve','reject'].includes(decision))return;simulationState.decision=decision;simContext.approvals.push((pending.step.data.tool_name||'tool')+': '+decision);masteryState.approvalResolved=true;if(agentBlueprint.functionTool.approval==='conditional'&&approvalRequired(pending.step.data.arguments||{}))masteryState.approvalRuleTriggered=true;saveMastery();document.getElementById('approval-panel').classList.add('hidden');updatePendingTimelineState(decision==='approve'?'approved':'rejected');appendSimLog(decision==='approve'?'approval.approved':'approval.rejected',{call_id:pending.step.data.call_id,tool_name:pending.step.data.tool_name,decision:decision,run_state:'resumable'});simulationState.pendingApproval=null;setSimulationStatus('running');
  if(decision==='reject'){simulationState.queue=simulationState.queue.filter(function(step,index){return index<simulationState.cursor||!step.requiresApproved;});simContext.failed=true;simContext.failure={title:labT('Approval rejected','تم رفض الموافقة'),cause:labT('The required tool was not executed because the human decision was Reject.','لم تُنفذ الأداة المطلوبة لأن القرار البشري كان الرفض.'),inspect:'Builder → Function approval / Trace'};masteryState.debugFixed=false;}
  scheduleSimulationStep(130);refreshMastery();
}
function completeSimulationRun(){
  if(simulationState.timer)clearTimeout(simulationState.timer);simulationState.timer=null;setSimulationStatus(simContext.failed?'failed':(simulationState.decision==='reject'?'rejected':'completed'));appendSimLog('run.completed',{simulation:true,session_id:simulationState.sessionId,outcome:simContext.failed?'failed_or_partial':'completed',scenario:simContext.scenario});buildTraceFromSimulation();renderSimulationOutput();masteryState.simulation=true;if(!simContext.failed&&labState.lastFailure)masteryState.debugFixed=true;labState.lastFailure=simContext.failure?labCopy(simContext.failure):labState.lastFailure;labState.lastOutcome={status:simulationState.status,scenario:simContext.scenario,at:new Date().toISOString()};saveMastery();refreshMastery();renderLearningHome();}

var baseClearSimulationStateLab=clearSimulationState;
clearSimulationState=function(resetHeader){baseClearSimulationStateLab(resetHeader);var final=document.getElementById('final-user-output');if(final)final.textContent=labT('Run a simulation to see the final user-facing output.','شغّل المحاكاة لرؤية المخرج النهائي للمستخدم.');document.getElementById('structured-output-box')?.classList.add('hidden');document.getElementById('simulation-root-cause')?.classList.add('hidden');document.getElementById('simulation-input-summary')?.querySelectorAll('dd').forEach(function(dd){dd.textContent='—';});document.getElementById('simulation-output-summary')?.querySelectorAll('dd').forEach(function(dd){dd.textContent='—';});};

function createTimelineElement(step,index){
  var copy=timelineStepText(step),row=document.createElement('article');row.className='timeline-step';row.dataset.kind=step.kind;row.dataset.state=step.state||'complete';row.setAttribute('role','listitem');row.tabIndex=0;row.setAttribute('aria-label',copy.title+'. '+copy.description);var marker=document.createElement('span');marker.className='timeline-step-marker';marker.innerHTML='<i data-lucide="'+timelineIcon(step.kind)+'"></i>';var card=document.createElement('div');card.className='timeline-step-card';var top=document.createElement('div');top.className='timeline-step-top';var title=document.createElement('span');title.className='timeline-step-title';title.textContent=copy.title;var badge=document.createElement('span');badge.className='timeline-step-badge';badge.textContent=timelineBadgeText(step.state||'complete');top.append(title,badge);var desc=document.createElement('div');desc.className='timeline-step-desc';desc.textContent=copy.description;var time=document.createElement('time');time.className='timeline-step-time';time.dateTime=step.timestamp||new Date().toISOString();time.textContent=step.timeLabel||new Date(step.timestamp||Date.now()).toLocaleTimeString();card.append(top,desc,time);
  var details=document.createElement('details');details.className='timeline-why';var summary=document.createElement('summary');summary.textContent=labT('Why did this happen?','لماذا حدث هذا؟');details.append(summary);var meta=step.meta||{};var grid=document.createElement('div');grid.className='timeline-why-grid';[['Why',meta.why],['Triggered by',meta.trigger],['Configured in',meta.setting],['If disabled',meta.disabledEffect]].forEach(function(r){var d=document.createElement('div');d.innerHTML='<span>'+escapeHtml(labT(r[0],({'Why':'السبب','Triggered by':'المحفز','Configured in':'الإعداد','If disabled':'إذا عُطل'})[r[0]]||r[0]))+':</span> '+escapeHtml(r[1]||'—');grid.append(d);});details.append(grid);details.addEventListener('click',function(e){e.stopPropagation();});card.append(details);row.append(marker,card);var inspect=function(){selectTechnicalEvent(step.eventIndex,true);};row.addEventListener('click',inspect);row.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect();}});lucide.createIcons(row);return row;
}

var baseAppendTimelineStepLab=appendTimelineStep;
appendTimelineStep=function(step){var idx=baseAppendTimelineStepLab(step);if(step.eventName==='function.completed'){simContext.toolResult=labCopy(step.data?.output||{});pushToolUse(step.data?.tool_name||agentBlueprint.functionTool.name);masteryState.functionCalled=true;saveMastery();refreshMastery();}return idx;};
Object.assign(phase3Text.en,{step_failed:'Failed'});Object.assign(phase3Text.ar,{step_failed:'فشل'});

function selectedTraceSpan(){return traceState.spans.find(function(s){return s.id===traceState.selectedId;})||traceState.spans[0]||null;}
function traceBuilderTarget(span){if(!span)return'builder-identity';var title=(span.title||'').toLowerCase();if(span.kind==='tool'){if(title.includes('mcp'))return'builder-tools-card';if(title.includes('web'))return'builder-tools-card';return'builder-tools-card';}if(span.kind==='approval')return'builder-tools-card';if(span.kind==='guardrail'){if(title.includes('structured'))return'builder-output-card';return'builder-guardrails-card';}if(span.kind==='handoff')return'builder-orchestration-card';if(span.kind==='final')return'builder-output-card';return'builder-identity';}
function renderTraceTeaching(){
  var panel=document.getElementById('trace-teaching-panel');if(!panel)return;var span=selectedTraceSpan();if(!span){['trace-teach-what','trace-teach-why','trace-teach-input','trace-teach-output','trace-teach-setting','trace-teach-issue','trace-teach-next'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent='—';});return;}
  var payload=span.payload||{},setting=traceBuilderTarget(span).replace('builder-','').replace('-card','').replace(/-/g,' '),failed=span.status==='failed'||span.status==='rejected';
  var why=span.kind==='tool'?labT('The configured capability was available and the run path selected it.','كانت القدرة المعدّة متاحة واختارها مسار التشغيل.'):span.kind==='approval'?labT('The tool approval policy required a decision before execution.','تطلبت سياسة موافقة الأداة قراراً قبل التنفيذ.'):span.kind==='guardrail'?labT('A configured or selected training validation step evaluated the run.','قيّمت خطوة تحقق تدريبية معدّة أو محددة التشغيل.'):span.kind==='handoff'?labT('The orchestration configuration delegated or transferred work to a specialist.','فوّض إعداد التنسيق العمل أو نقله إلى متخصص.'):labT('This span is part of the Agent run sequence.','هذا span جزء من تسلسل تشغيل Agent.');
  var issue=failed?(payload.error||labT('This span did not complete successfully. Inspect its input, configuration, and preceding parent span.','لم يكتمل هذا span بنجاح. افحص مدخله وإعداده والـ parent السابق.')):labT('No failure recorded on this span.','لا يوجد فشل مسجل على هذا span.');
  var next=failed?labT('Inspect the related Builder setting, then rerun the same scenario after correcting it.','افحص إعداد المنشئ المرتبط ثم أعد تشغيل السيناريو نفسه بعد التصحيح.'):labT('Inspect the next child span to understand how this result influenced the run.','افحص span التالي لفهم كيف أثرت النتيجة على التشغيل.');
  document.getElementById('trace-teach-what').textContent=span.description||span.title;
  document.getElementById('trace-teach-why').textContent=why;
  document.getElementById('trace-teach-input').textContent=JSON.stringify(payload.arguments||payload.query||payload.content||payload,null,0).slice(0,220)||'—';
  document.getElementById('trace-teach-output').textContent=JSON.stringify(payload.output||payload.result||payload.error||'—',null,0).slice(0,220);
  document.getElementById('trace-teach-setting').textContent=setting;
  document.getElementById('trace-teach-issue').textContent=String(issue);
  document.getElementById('trace-teach-next').textContent=next;
  if(failed){masteryState.traceFailureIdentified=true;saveMastery();refreshMastery();}
}
var baseRenderTraceInspectorLab=renderTraceInspector;
renderTraceInspector=function(){baseRenderTraceInspectorLab();renderTraceTeaching();};
selectTraceSpan=function(id){if(!traceState.spans.some(function(s){return s.id===id;}))return;traceState.selectedId=id;renderTraceInspector();};
function showSelectedTraceInBuilder(){var span=selectedTraceSpan();switchTab('builder');selectBuilderView('visual');setTimeout(function(){highlightBuilderSection(traceBuilderTarget(span));},70);}

function loadCustomOrchestration(){try{var s=JSON.parse(localStorage.getItem('agentlab.customOrchestration')||'null');if(s&&Array.isArray(s.nodes)&&Array.isArray(s.edges))return s;}catch(_){}return {nodes:[{id:'node_agent',type:'agent',label:'Agent'},{id:'node_final',type:'final',label:'Final Output'}],edges:[{from:'node_agent',to:'node_final'}]};}
labState.customOrchestration=loadCustomOrchestration();
function saveCustomOrchestration(){try{localStorage.setItem('agentlab.customOrchestration',JSON.stringify(labState.customOrchestration));}catch(_){}}
function nodeLabel(type,n){var labels={agent:'Agent',agent_tool:'Agent as Tool',handoff:'Handoff',function:'Function Tool',mcp:'MCP',approval:'Approval',guardrail:'Guardrail',final:'Final Output'};return (labels[type]||type)+(n>1?' '+n:'');}
function addOrchestrationNode(){var type=document.getElementById('custom-node-type')?.value||'agent',count=labState.customOrchestration.nodes.filter(function(n){return n.type===type;}).length+1;labState.customOrchestration.nodes.push({id:labId('node'),type:type,label:nodeLabel(type,count)});saveCustomOrchestration();renderCustomOrchestration();}
function removeOrchestrationNode(id){labState.customOrchestration.nodes=labState.customOrchestration.nodes.filter(function(n){return n.id!==id;});labState.customOrchestration.edges=labState.customOrchestration.edges.filter(function(e){return e.from!==id&&e.to!==id;});saveCustomOrchestration();renderCustomOrchestration();}
function connectOrchestrationNodes(){var from=document.getElementById('connection-from')?.value,to=document.getElementById('connection-to')?.value;if(!from||!to||from===to){showToast(labT('Choose two different nodes.','اختر عقدتين مختلفتين.'));return;}if(!labState.customOrchestration.edges.some(function(e){return e.from===from&&e.to===to;}))labState.customOrchestration.edges.push({from:from,to:to});saveCustomOrchestration();renderCustomOrchestration();}
function removeOrchestrationEdge(index){labState.customOrchestration.edges.splice(index,1);saveCustomOrchestration();renderCustomOrchestration();}
function hasCycle(){var nodes=labState.customOrchestration.nodes.map(function(n){return n.id;}),adj={};nodes.forEach(function(n){adj[n]=[];});labState.customOrchestration.edges.forEach(function(e){if(adj[e.from])adj[e.from].push(e.to);});var seen={},stack={};function dfs(n){if(stack[n])return true;if(seen[n])return false;seen[n]=1;stack[n]=1;for(var i=0;i<(adj[n]||[]).length;i++)if(dfs(adj[n][i]))return true;stack[n]=0;return false;}return nodes.some(dfs);}
function architectureIssues(){var ns=labState.customOrchestration.nodes,issues=[];if(!ns.length)issues.push(labT('No nodes configured.','لا توجد عقد معدّة.'));if(!ns.some(function(n){return n.type==='agent';}))issues.push(labT('No primary Agent.','لا يوجد Agent رئيسي.'));if(!ns.some(function(n){return n.type==='final';}))issues.push(labT('No final output owner.','لا يوجد مالك للمخرج النهائي.'));if(hasCycle())issues.push(labT('Circular flow detected.','تم اكتشاف مسار دائري.'));if(ns.some(function(n){return ['function','mcp'].includes(n.type);})&&!labState.customOrchestration.edges.length)issues.push(labT('Tool nodes are not connected.','عقد الأدوات غير مرتبطة.'));if(ns.some(function(n){return n.type==='function';})&&!ns.some(function(n){return n.type==='approval';})&&agentBlueprint.functionTool.approval!=='never')issues.push(labT('Sensitive function has no visible Approval node.','الدالة الحساسة بلا عقدة Approval ظاهرة.'));if(ns.length>7)issues.push(labT('Potential unnecessary complexity: more than seven nodes.','تعقيد محتمل غير ضروري: أكثر من سبع عقد.'));return issues;}
function renderCustomOrchestration(){
  var root=document.getElementById('custom-orchestration-nodes');if(!root)return;root.innerHTML='';labState.customOrchestration.nodes.forEach(function(n){var el=document.createElement('div');el.className='custom-node';el.dataset.kind=n.type;el.innerHTML='<span>'+escapeHtml(n.label)+'</span><small>'+escapeHtml(n.type)+'</small><button type="button" aria-label="'+labT('Remove node','حذف العقدة')+'">×</button>';el.querySelector('button').onclick=function(){removeOrchestrationNode(n.id);};root.append(el);});
  ['connection-from','connection-to'].forEach(function(id){var sel=document.getElementById(id);if(!sel)return;var old=sel.value;sel.innerHTML='';labState.customOrchestration.nodes.forEach(function(n){var o=document.createElement('option');o.value=n.id;o.textContent=n.label;sel.append(o);});if([...sel.options].some(function(o){return o.value===old;}))sel.value=old;});
  var edges=document.getElementById('custom-orchestration-edges');if(edges){edges.innerHTML='';labState.customOrchestration.edges.forEach(function(e,i){var a=labState.customOrchestration.nodes.find(function(n){return n.id===e.from;}),b=labState.customOrchestration.nodes.find(function(n){return n.id===e.to;});if(!a||!b)return;var row=document.createElement('div');row.innerHTML='<span>'+escapeHtml(a.label)+' → '+escapeHtml(b.label)+'</span><button type="button" aria-label="'+labT('Remove connection','حذف الربط')+'">×</button>';row.querySelector('button').onclick=function(){removeOrchestrationEdge(i);};edges.append(row);});}
  var issues=architectureIssues(),val=document.getElementById('architecture-validation');if(val){var valid=issues.length===0;val.dataset.state=valid?'valid':'warning';val.innerHTML='<strong>'+escapeHtml(valid?labT('Architecture valid','المعمارية صالحة'):labT('Check this architecture','راجع هذه المعمارية'))+'</strong>'+(valid?'<p>'+escapeHtml(labT('The training graph has an Agent, connected flow, and Final Output.','يحتوي مخطط التدريب على Agent ومسار مترابط وFinal Output.'))+'</p>':'<ul>'+issues.map(function(x){return'<li>'+escapeHtml(x)+'</li>';}).join('')+'</ul>');if(valid){masteryState.orchestrationValid=true;saveMastery();}}
  lucide.createIcons(root);refreshMastery();
}
function explainCustomArchitecture(){var ns=labState.customOrchestration.nodes,types=ns.map(function(n){return n.type;}),parts=[];if(types.includes('agent'))parts.push(labT('The Agent owns the request.','Agent يملك الطلب.'));if(types.includes('agent_tool'))parts.push(labT('A specialist can be called while the manager keeps control.','يمكن استدعاء متخصص مع بقاء المدير مسيطراً.'));if(types.includes('handoff'))parts.push(labT('A Handoff can transfer control to another Agent.','يمكن لـ Handoff نقل التحكم إلى Agent آخر.'));if(types.includes('function'))parts.push(labT('A Function Tool represents application code the model may call.','تمثل Function Tool كود تطبيق قد يستدعيه النموذج.'));if(types.includes('mcp'))parts.push(labT('MCP represents tools exposed by a server.','يمثل MCP أدوات يعرضها خادم.'));if(types.includes('approval'))parts.push(labT('Approval pauses a sensitive call for a human decision.','توقف Approval الاستدعاء الحساس لقرار بشري.'));if(types.includes('guardrail'))parts.push(labT('Guardrails can block or validate a step.','يمكن للضوابط حظر خطوة أو التحقق منها.'));if(types.includes('final'))parts.push(labT('Final Output is the user-facing result.','Final Output هو النتيجة التي يراها المستخدم.'));var root=document.getElementById('architecture-explanation');root.classList.remove('hidden');root.textContent=parts.join(' ');}

function pyIdent(name){var s=String(name||'tool').replace(/[^A-Za-z0-9_]/g,'_');if(!/^[A-Za-z_]/.test(s))s='tool_'+s;return s||'tool';}
function pyType(type){return ({string:'str',number:'float',boolean:'bool',array:'list[str]',enum:'str'})[type]||'str';}
function pyLiteral(value){if(value===true)return'True';if(value===false)return'False';if(value===null)return'None';if(typeof value==='number')return String(value);return JSON.stringify(String(value));}
function pyOutputClass(){if(agentBlueprint.output!=='structured')return'';var lines=['class AgentOutput(BaseModel):'];(agentBlueprint.outputSchema.fields||[]).forEach(function(f){var typ=f.type==='enum'?'Literal["low", "medium", "high"]':pyType(f.type);if(!f.required)typ+=' | None';lines.push('    '+pyIdent(f.name)+': '+typ+(f.required?'':' = None'));});if(lines.length===1)lines.push('    result: str');return lines.join('\n');}
function pyFunctionBlock(){if(!agentBlueprint.tools.includes('function'))return'';var ft=agentBlueprint.functionTool,n=pyIdent(ft.name),args=(ft.args||[]).map(function(a){return pyIdent(a.name)+': '+pyType(a.type)+(a.required?'':' = None');}).join(', '),approval='False',pre='';if(ft.approval==='always')approval='True';if(ft.approval==='conditional'){var m=(ft.approvalRule||'').match(/^([A-Za-z_][\w]*)\s*(>=|<=|>|<|==|=)\s*(-?\d+(?:\.\d+)?)$/);pre+='async def needs_review(_ctx, params, _call_id) -> bool:\n';if(m){pre+='    value = params.get('+JSON.stringify(m[1])+')\n    if not isinstance(value, (int, float)):\n        return True  # fail closed when the rule cannot be evaluated\n    return value '+(m[2]==='='?'==':m[2])+' '+m[3]+'\n\n';}else pre+='    return True  # fail closed: review the call manually\n\n';approval='needs_review';}
  var guardArg=agentBlueprint.guardrails.includes('tool')?', tool_input_guardrails=[allow_tool_input]':'';
  return pre+'@tool(needs_approval='+approval+guardArg+')\nasync def '+n+'('+args+') -> str:\n    """'+String(ft.description||'Application function').replace(/"""/g,'')+'"""\n    # Replace this training return value with your application logic.\n    return json.dumps('+JSON.stringify(ft.simulatedResult||{})+')\n';}
function pyGuardrailBlock(){var lines=[];if(agentBlueprint.guardrails.includes('tool'))lines.push('@tool_input_guardrail','def allow_tool_input(data):','    # Replace with your real policy.','    return ToolGuardrailFunctionOutput.allow()','');if(agentBlueprint.guardrails.includes('input'))lines.push('@input_guardrail','async def validate_input(ctx, agent, input):','    return GuardrailFunctionOutput(output_info={"checked": True}, tripwire_triggered=False)','');if(agentBlueprint.guardrails.includes('output'))lines.push('@output_guardrail','async def validate_output(ctx, agent, output):','    return GuardrailFunctionOutput(output_info={"checked": True}, tripwire_triggered=False)','');return lines.join('\n');}
function pyToolsBlock(){var lines=['tools = []'];if(agentBlueprint.tools.includes('web_search'))lines.push('tools.append(WebSearchTool())');if(agentBlueprint.tools.includes('mcp')){if(agentBlueprint.mcp.transport==='hosted')lines.push('tools.append(HostedMCPTool(tool_config={','    "type": "mcp",','    "server_label": '+JSON.stringify(agentBlueprint.mcp.serverLabel)+',','    "server_url": '+JSON.stringify(agentBlueprint.mcp.serverUrl)+',','    "require_approval": '+JSON.stringify(agentBlueprint.mcp.approval||'never')+',','}))');else lines.push('# Local MCP selected in the visual Builder.',' # Use MCPServerStreamableHttp / MCPServerSse / MCPServerStdio with agent.mcp_servers.');}if(agentBlueprint.tools.includes('function'))lines.push('tools.append('+pyIdent(agentBlueprint.functionTool.name)+')');if(agentBlueprint.tools.includes('agent_tool'))lines.push('specialist = Agent(name="Research specialist", instructions="Handle the delegated research task and return a concise result.")','tools.append(specialist.as_tool(tool_name="research_specialist", tool_description="Delegate focused research to a specialist."))');return lines.join('\n');}
function pyAgentBlock(){var lines=[];if(agentBlueprint.handoff!=='none')lines.push('handoff_agent = Agent(name='+JSON.stringify(agentBlueprint.handoff==='support'?'Support specialist':'Research specialist')+', instructions="Take over this specialist request and respond clearly.")','');lines.push('agent = Agent(','    name='+JSON.stringify(agentBlueprint.name)+',','    instructions='+JSON.stringify(agentBlueprint.instructions)+',','    model='+JSON.stringify(agentBlueprint.model)+',','    tools=tools,');if(agentBlueprint.guardrails.includes('input'))lines.push('    input_guardrails=[validate_input],');if(agentBlueprint.guardrails.includes('output'))lines.push('    output_guardrails=[validate_output],');if(agentBlueprint.handoff!=='none')lines.push('    handoffs=[handoff_agent],');if(agentBlueprint.output==='structured')lines.push('    output_type=AgentOutput,');lines.push(')');return lines.join('\n');}
function pyRuntimeBlock(){var lines=['async def main() -> None:'];if(agentBlueprint.session)lines.push('    session = OpenAIConversationsSession()');lines.push('    result = await Runner.run(agent, "Replace with the user input"'+(agentBlueprint.session?', session=session':'')+')','    if result.interruptions:','        state = result.to_state()','        for interruption in result.interruptions:','            # Your application should collect a real human decision here.','            state.approve(interruption)','        result = await Runner.run(agent, state'+(agentBlueprint.session?', session=session':'')+')','    print(result.final_output)','','asyncio.run(main())');return lines.join('\n');}
function pythonSdkCode(section){var imports=['import asyncio','import json'];if(agentBlueprint.output==='structured')imports.push('from typing import Literal','from pydantic import BaseModel');var names=['Agent','Runner'];if(agentBlueprint.tools.includes('web_search'))names.push('WebSearchTool');if(agentBlueprint.tools.includes('mcp')&&agentBlueprint.mcp.transport==='hosted')names.push('HostedMCPTool');if(agentBlueprint.session)names.push('OpenAIConversationsSession');if(agentBlueprint.guardrails.includes('tool'))names.push('ToolGuardrailFunctionOutput');if(agentBlueprint.guardrails.includes('input')||agentBlueprint.guardrails.includes('output'))names.push('GuardrailFunctionOutput');imports.push('from agents import '+[...new Set(names)].join(', '));var decorators=[];if(agentBlueprint.tools.includes('function'))decorators.push('tool');if(agentBlueprint.guardrails.includes('tool'))decorators.push('tool_input_guardrail');if(agentBlueprint.guardrails.includes('input'))decorators.push('input_guardrail');if(agentBlueprint.guardrails.includes('output'))decorators.push('output_guardrail');if(decorators.length)imports.push('from agents.decorators import '+[...new Set(decorators)].join(', '));var guards=pyGuardrailBlock(),fn=pyFunctionBlock(),tools=pyToolsBlock(),out=pyOutputClass(),agent=pyAgentBlock(),runtime=pyRuntimeBlock();var pieces={agent:[out,agent].filter(Boolean).join('\n\n'),tools:[guards,fn,tools].filter(Boolean).join('\n\n'),guardrails:guards||'# No guardrails configured.',runtime:runtime};if(section&&section!=='full')return pieces[section]||pieces.agent;return '# VERIFIED SDK EXAMPLE — checked against current OpenAI Agents SDK documentation\n'+imports.join('\n')+'\n\n'+[out,guards,fn,tools,agent,runtime].filter(Boolean).join('\n\n')+'\n';}

function zodForArg(a){if(a.type==='number')return'z.number()';if(a.type==='boolean')return'z.boolean()';if(a.type==='array')return'z.array(z.string())';return'z.string()';}
function jsOutputSchema(){if(agentBlueprint.output!=='structured')return'';var lines=['const AgentOutput = z.object({'];(agentBlueprint.outputSchema.fields||[]).forEach(function(f){var z=f.type==='array'?'z.array(z.string())':f.type==='number'?'z.number()':f.type==='boolean'?'z.boolean()':f.type==='enum'?"z.enum(['low', 'medium', 'high'])":'z.string()';if(!f.required)z+='.optional()';lines.push('  '+JSON.stringify(f.name)+': '+z+',');});lines.push('});');return lines.join('\n');}
function jsFunctionBlock(){if(!agentBlueprint.tools.includes('function'))return'';var ft=agentBlueprint.functionTool,params=(ft.args||[]).map(function(a){return'    '+JSON.stringify(a.name)+': '+zodForArg(a)+(a.required?'':'.optional()')+',';}).join('\n'),approval='false';if(ft.approval==='always')approval='true';if(ft.approval==='conditional'){var m=(ft.approvalRule||'').match(/^([A-Za-z_][\w]*)\s*(>=|<=|>|<|==|=)\s*(-?\d+(?:\.\d+)?)$/);if(m)approval='async (_context, args) => typeof args['+JSON.stringify(m[1])+'] !== "number" || args['+JSON.stringify(m[1])+'] '+(m[2]==='='?'===':m[2])+' '+m[3];else approval='async () => true';}
 return 'const appTool = tool({\n  name: '+JSON.stringify(ft.name)+',\n  description: '+JSON.stringify(ft.description)+',\n  parameters: z.object({\n'+params+'\n  }),\n  needsApproval: '+approval+',\n  execute: async (args) => {\n    // Replace this training result with your application logic.\n    return JSON.stringify('+JSON.stringify(ft.simulatedResult||{})+');\n  },\n});';}
function jsToolsBlock(){var lines=['const tools = [];'];if(agentBlueprint.tools.includes('web_search'))lines.push('tools.push(webSearchTool());');if(agentBlueprint.tools.includes('mcp')){if(agentBlueprint.mcp.transport==='hosted')lines.push('tools.push(hostedMcpTool({','  serverLabel: '+JSON.stringify(agentBlueprint.mcp.serverLabel)+',','  serverUrl: '+JSON.stringify(agentBlueprint.mcp.serverUrl)+',','  requireApproval: '+JSON.stringify(agentBlueprint.mcp.approval||'never')+',','}));');else lines.push('// Local MCP selected: use MCPServerStreamableHttp / MCPServerSSE / MCPServerStdio and mcpServers.');}if(agentBlueprint.tools.includes('function'))lines.push('tools.push(appTool);');if(agentBlueprint.tools.includes('agent_tool'))lines.push('const specialist = new Agent({ name: "Research specialist", instructions: "Handle delegated research and return a concise result." });','tools.push(specialist.asTool({ toolName: "research_specialist", toolDescription: "Delegate focused research to a specialist." }));');return lines.join('\n');}
function jsAgentBlock(){var lines=[];if(agentBlueprint.handoff!=='none')lines.push('const handoffAgent = new Agent({ name: '+JSON.stringify(agentBlueprint.handoff==='support'?'Support specialist':'Research specialist')+', instructions: "Take over this specialist request and respond clearly." });','');lines.push('const agent = new Agent({','  name: '+JSON.stringify(agentBlueprint.name)+',','  instructions: '+JSON.stringify(agentBlueprint.instructions)+',','  model: '+JSON.stringify(agentBlueprint.model)+',','  tools,');if(agentBlueprint.handoff!=='none')lines.push('  handoffs: [handoffAgent],');if(agentBlueprint.output==='structured')lines.push('  outputType: AgentOutput,');if(agentBlueprint.guardrails.length)lines.push('  // Add your validated input/output guardrail definitions here.');lines.push('});');return lines.join('\n');}
function jsRuntimeBlock(){var lines=[];if(agentBlueprint.session)lines.push('const session = new OpenAIConversationsSession();');lines.push('let result = await run(agent, "Replace with the user input"'+(agentBlueprint.session?', { session }':'')+');','if (result.interruptions.length > 0) {','  for (const interruption of result.interruptions) {','    // Your application should collect a real human decision here.','    result.state.approve(interruption);','  }','  result = await run(agent, result.state'+(agentBlueprint.session?', { session }':'')+');','}','console.log(result.finalOutput);');return lines.join('\n');}
function javascriptSdkCode(section){var names=['Agent','run'];if(agentBlueprint.tools.includes('function'))names.push('tool');if(agentBlueprint.tools.includes('web_search'))names.push('webSearchTool');if(agentBlueprint.tools.includes('mcp')&&agentBlueprint.mcp.transport==='hosted')names.push('hostedMcpTool');if(agentBlueprint.session)names.push('OpenAIConversationsSession');var imports="import { "+[...new Set(names)].join(', ')+" } from '@openai/agents';\nimport { z } from 'zod';",out=jsOutputSchema(),fn=jsFunctionBlock(),tools=jsToolsBlock(),agent=jsAgentBlock(),runtime=jsRuntimeBlock(),pieces={agent:[out,agent].filter(Boolean).join('\n\n'),tools:[fn,tools].filter(Boolean).join('\n\n'),guardrails:agentBlueprint.guardrails.length?'// TRAINING REPRESENTATION: add SDK guardrail definitions matching your real policy.':'// No guardrails configured.',runtime:runtime};if(section&&section!=='full')return pieces[section]||pieces.agent;return '// '+(codeExampleVerified('javascript')?'VERIFIED SDK EXAMPLE':'TRAINING REPRESENTATION')+' — current Agents SDK pattern\n'+imports+'\n\n'+[out,fn,tools,agent,runtime].filter(Boolean).join('\n\n')+'\n';}
function curlResponsesCode(){var tools=[];if(agentBlueprint.tools.includes('web_search'))tools.push({type:'web_search'});var body={model:agentBlueprint.model,input:'Replace with the user input'};if(tools.length)body.tools=tools;return '# TRAINING REPRESENTATION for direct Responses API use\n# Agents SDK features such as Runner, handoffs, Sessions and SDK guardrails are not represented by one REST agent object.\ncurl https://api.openai.com/v1/responses \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '+shellSingleQuoted(JSON.stringify(body,null,2))+'\n';}
function codeExampleVerified(lang){if(lang==='curl')return false;if(agentBlueprint.tools.includes('mcp')&&agentBlueprint.mcp.transport!=='hosted')return false;if(lang==='javascript'&&agentBlueprint.guardrails.length)return false;return true;}
generateBlueprintCode=function(lang,section){if(section==='json')return JSON.stringify(trainingConfigObject(),null,2);if(lang==='python')return pythonSdkCode(section);if(lang==='javascript')return javascriptSdkCode(section);return curlResponsesCode();};
var baseGenerateCodeLab=generateCode;
generateCode=function(){baseGenerateCodeLab();var lang=document.getElementById('code-lang')?.value||'python',badge=document.getElementById('code-accuracy-badge');if(badge){var verified=codeExampleVerified(lang);badge.className='accuracy-badge '+(verified?'verified':'training');badge.textContent=verified?labT('VERIFIED SDK EXAMPLE','مثال SDK تم التحقق منه'):labT('TRAINING REPRESENTATION','تمثيل تدريبي');}renderConfigurationViews();updateCodeDiff();};
var baseSelectCodeSectionLab=selectCodeSection;
selectCodeSection=function(section){if(section==='tools'){masteryState.codeToolSectionVisited=true;saveMastery();}baseSelectCodeSectionLab(section);refreshMastery();};
function configDiff(){var before=labState.previousConfig||{},after=agentBlueprint,d=[];['name','instructions','model','handoff','session','output'].forEach(function(k){if(JSON.stringify(before[k])!==JSON.stringify(after[k]))d.push({key:k,before:before[k],after:after[k]});});if(JSON.stringify(before.tools)!==JSON.stringify(after.tools))d.push({key:'tools',before:before.tools||[],after:after.tools||[]});if(JSON.stringify(before.guardrails)!==JSON.stringify(after.guardrails))d.push({key:'guardrails',before:before.guardrails||[],after:after.guardrails||[]});return d;}
function updateCodeDiff(){var root=document.getElementById('code-diff-output'),title=document.getElementById('code-diff-title'),ex=document.getElementById('code-diff-explanation');if(!root)return;var diffs=configDiff();title.textContent=diffs.length?labT('Latest Blueprint change','آخر تغيير في المخطط'):labT('No recent configuration change','لا يوجد تغيير حديث');root.textContent=diffs.length?diffs.map(function(d){return'- '+d.key+': '+JSON.stringify(d.before)+'\n+ '+d.key+': '+JSON.stringify(d.after);}).join('\n\n'):labT('Make a Builder change to see the difference here.','عدّل إعداداً في المنشئ لرؤية الفرق هنا.');ex.textContent=diffs.length?labT('Only changed Blueprint fields are shown. The generated SDK code above has already been regenerated.','يتم عرض حقول المخطط المتغيرة فقط. تم تحديث كود SDK أعلاه بالفعل.'):' ';}
function toggleCodeDiff(){labState.codeDiffOpen=!labState.codeDiffOpen;document.getElementById('code-diff-panel')?.classList.toggle('hidden',!labState.codeDiffOpen);updateCodeDiff();}
function explainCurrentCode(){var panel=document.getElementById('code-explain-panel'),copy=document.getElementById('code-explain-copy'),section=currentCodeSection;var text={full:labT('This example creates the configured Agent, attaches its enabled tools and optional structured output, then runs it. If a tool needs approval, the example resumes from the returned run state.','ينشئ المثال Agent المعدّ ويربط الأدوات والمخرجات المنظمة الاختيارية ثم يشغله. إذا احتاجت أداة إلى موافقة، يستأنف المثال من حالة التشغيل المعادة.'),agent:labT('This section maps the visual Agent name, instructions, model, handoffs and output type into the SDK Agent configuration.','يربط هذا القسم اسم Agent وتعليماته ونموذجه وتسليماته ونوع المخرج بإعداد SDK.'),tools:labT('This section gives the Agent its enabled capabilities. Function-tool schemas tell the model which arguments are valid; hosted tools and agent tools are added to the same tool list.','يمنح هذا القسم Agent القدرات المفعلة. تحدد مخططات Function Tool المدخلات الصالحة وتضاف الأدوات المستضافة والوكلاء كأدوات إلى قائمة الأدوات.'),guardrails:labT('This section shows the guardrail definitions represented by the current code example.','يعرض هذا القسم تعريفات الضوابط التي يمثلها مثال الكود الحالي.'),runtime:labT('This section runs the Agent, optionally with a Session, and demonstrates the documented pause → approve/reject → resume flow for tool approvals.','يشغّل هذا القسم Agent مع Session اختيارية ويعرض مسار التوقف ثم الموافقة/الرفض ثم الاستئناف.'),json:labT('This JSON is a training representation of the Blueprint, not an official API request object.','هذا JSON تمثيل تدريبي للمخطط وليس كائن طلب رسمي إلى API.')}[section]||'';copy.textContent=text;panel.classList.remove('hidden');masteryState.codeExplained=true;saveMastery();refreshMastery();}
async function copyCurrentCodeSection(){await copyLabText(document.getElementById('code-display')?.textContent||'');showToast(labT('Code section copied.','تم نسخ قسم الكود.'));}
function resetCodeExample(){document.getElementById('code-lang').value='python';document.getElementById('code-scenario').value='blueprint';currentCodeSection='full';document.querySelectorAll('[data-code-section]').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.codeSection==='full'));});labState.codeDiffOpen=false;document.getElementById('code-diff-panel')?.classList.add('hidden');document.getElementById('code-explain-panel')?.classList.add('hidden');generateCode();}

function functionSchemaValid(){var args=agentBlueprint.functionTool?.args||[],names=args.map(function(a){return(a.name||'').trim();});return !!agentBlueprint.functionTool?.name && args.length>0 && names.every(Boolean) && new Set(names).size===names.length;}
var LAB_MISSIONS=[
 {id:'describe',title:['Describe and accept an Agent','صف الوكيل واعتمد المخطط'],desc:['Generate a Blueprint from plain language and accept the proposed configuration.','أنشئ مخططاً من وصف عادي واعتمد الإعداد المقترح.'],target:'builder',anchor:'describe-agent-card'},
 {id:'function',title:['Build and call a Function Tool','ابنِ واستدعِ Function Tool'],desc:['Create a valid function schema and complete a simulation that actually calls it.','أنشئ مخطط دالة صالحاً وأكمل محاكاة تستدعيه فعلياً.'],target:'builder',anchor:'function-tool-designer'},
 {id:'approval',title:['Trigger and resolve conditional approval','شغّل موافقة مشروطة وحلها'],desc:['Configure a conditional approval rule, trigger the interruption, then approve or reject it.','اضبط قاعدة موافقة مشروطة وشغّل المقاطعة ثم وافق أو ارفض.'],target:'builder',anchor:'function-tool-designer'},
 {id:'structured',title:['Return valid structured output','أعد مخرجاً منظماً صالحاً'],desc:['Define a structured schema and complete a run whose final object validates successfully.','حدد مخططاً منظماً وأكمل تشغيلاً ينجح فيه التحقق من الكائن النهائي.'],target:'builder',anchor:'builder-output-card'},
 {id:'orchestration',title:['Build a valid orchestration','ابنِ تنسيقاً صالحاً'],desc:['Add or connect nodes, then leave the custom architecture in a valid state.','أضف أو اربط عقداً ثم اترك المعمارية المخصصة في حالة صالحة.'],target:'architecture',anchor:'custom-orchestration-title'},
 {id:'trace',title:['Find the failed trace span','حدد span الفاشل'],desc:['Run a failure scenario and select the span that explains the failure.','شغّل سيناريو فشل وحدد span الذي يفسر السبب.'],target:'trace'},
 {id:'debug',title:['Fix and rerun successfully','أصلح وأعد التشغيل بنجاح'],desc:['After a failed scenario, correct or change the setup and complete a successful run.','بعد سيناريو فاشل صحح الإعداد أو غيّره وأكمل تشغيلاً ناجحاً.'],target:'simulator'},
 {id:'code',title:['Map configuration to code','اربط الإعداد بالكود'],desc:['Open the Tools code section and use Explain code to prove the visual-to-code mapping.','افتح قسم Tools في الكود واستخدم شرح الكود لإثبات الربط بين المرئي والكود.'],target:'codestudio'},
 {id:'quiz',title:['Pass the knowledge check','اجتز اختبار المعرفة'],desc:['Answer every current Agents SDK knowledge question correctly.','أجب بشكل صحيح عن جميع أسئلة Agents SDK الحالية.'],target:'quiz',anchor:'knowledge-check'}
];
function missionIsComplete(id){if(id==='describe')return !!masteryState.draftAccepted;if(id==='function')return functionSchemaValid()&&agentBlueprint.tools.includes('function')&&!!masteryState.functionCalled;if(id==='approval')return agentBlueprint.functionTool?.approval==='conditional'&&!!masteryState.approvalRuleTriggered&&!!masteryState.approvalResolved;if(id==='structured')return agentBlueprint.output==='structured'&&!!masteryState.structuredValidated;if(id==='orchestration')return !!masteryState.orchestrationEdited&&architectureIssues().length===0;if(id==='trace')return !!masteryState.traceFailureIdentified;if(id==='debug')return !!masteryState.debugFixed;if(id==='code')return !!masteryState.codeExplained&&!!masteryState.codeToolSectionVisited;if(id==='quiz')return Array.isArray(masteryState.quizCorrect)&&masteryState.quizCorrect.length===quizQuestions.length;return false;}
function completedMissionCount(){return LAB_MISSIONS.filter(function(m){return missionIsComplete(m.id);}).length;}
function masteryLevelFor(count){return count>=9?labT('Master','متقن'):count>=6?labT('Operator','مشغّل'):count>=3?labT('Builder','منشئ'):labT('Explorer','مستكشف');}
function renderMasteryProgress(){var total=LAB_MISSIONS.length,done=completedMissionCount(),pct=Math.round(done/total*100),root=document.getElementById('mastery-progress');if(!root)return;root.setAttribute('aria-valuemax',String(total));root.setAttribute('aria-valuenow',String(done));document.getElementById('mastery-progress-bar').style.inlineSize=pct+'%';document.getElementById('mastery-progress-percent').textContent=pct+'%';document.getElementById('mastery-score-text').textContent=done+' / '+total;document.getElementById('mastery-level').textContent=masteryLevelFor(done);}
function renderMissions(){var list=document.getElementById('mission-list');if(!list)return;list.innerHTML='';LAB_MISSIONS.forEach(function(m,index){var complete=missionIsComplete(m.id),card=document.createElement('article');card.className='mission-card';card.dataset.complete=String(complete);var idx=document.createElement('span');idx.className='mission-index';idx.innerHTML=complete?'<i data-lucide="check"></i>':String(index+1).padStart(2,'0');var copy=document.createElement('div');copy.className='mission-copy';copy.innerHTML='<strong>'+escapeHtml(labT(m.title[0],m.title[1]))+'</strong><p>'+escapeHtml(labT(m.desc[0],m.desc[1]))+'</p>';var st=document.createElement('div');st.className='mission-status';st.innerHTML='<i data-lucide="'+(complete?'check-circle':'circle')+'"></i><span>'+escapeHtml(complete?labT('Completed','مكتملة'):labT('Not yet proved','لم تُثبت بعد'))+'</span>';var a=document.createElement('button');a.type='button';a.className='button button-secondary mission-action';a.textContent=complete?labT('Review','مراجعة'):labT('Start mission','ابدأ المهمة');a.onclick=function(){openMissionTarget(m.id);};card.append(idx,copy,st,a);list.append(card);});lucide.createIcons(list);}
function refreshMastery(){saveMastery();renderMasteryProgress();renderMissions();renderLearningHome();}
function openMissionTarget(id){var m=LAB_MISSIONS.find(function(x){return x.id===id;});if(!m)return;switchTab(m.target);if(m.anchor)setTimeout(function(){var el=document.getElementById(m.anchor);if(el)el.scrollIntoView({block:'center',behavior:motionBehavior()});},80);}

var rawMode='';try{rawMode=localStorage.getItem('agentlab.learningMode')||'';labState.guidedStep=Number(localStorage.getItem('agentlab.guidedStep')||0)||0;}catch(_){}if(['explore','guided'].includes(rawMode))labState.learningMode=rawMode;
var guidedSteps=[
 {tab:'builder',target:'describe-agent-card',en:'Step 1 · Describe the Agent you want in normal language.',ar:'الخطوة 1 · صف الوكيل الذي تريده بلغة عادية.'},
 {tab:'builder',target:'description-transform',en:'Step 2 · Generate the Blueprint and review what the lab understood.',ar:'الخطوة 2 · أنشئ المخطط وراجع ما فهمه المختبر.'},
 {tab:'builder',target:'builder-identity',en:'Step 3 · Inspect the generated Agent name and instructions.',ar:'الخطوة 3 · افحص اسم Agent والتعليمات المولدة.'},
 {tab:'builder',target:'builder-tools-card',en:'Step 4 · Enable or inspect Web Search and understand its effect.',ar:'الخطوة 4 · فعّل أو افحص Web Search وافهم أثرها.'},
 {tab:'simulator',target:'run-sim-btn',en:'Step 5 · Run the local training simulation.',ar:'الخطوة 5 · شغّل المحاكاة التدريبية المحلية.'},
 {tab:'trace',target:'trace-span-list',en:'Step 6 · Inspect a tool span and ask why it happened.',ar:'الخطوة 6 · افحص span لأداة واسأل لماذا حدث.'},
 {tab:'codestudio',target:'code-section-tabs',en:'Step 7 · Open the Tools code section and map it to the Blueprint.',ar:'الخطوة 7 · افتح قسم Tools في الكود واربطه بالمخطط.'},
 {tab:'quiz',target:'mission-list',en:'Step 8 · Complete a competency checkpoint.',ar:'الخطوة 8 · أكمل نقطة تحقق للكفاءة.'}
];
function setLearningMode(mode){if(!['explore','guided'].includes(mode))return;labState.learningMode=mode;try{localStorage.setItem('agentlab.learningMode',mode);}catch(_){}renderGuidedMode();if(mode==='guided')focusGuidedStep();}
function renderGuidedMode(){var guided=labState.learningMode==='guided',step=guidedSteps[Math.min(labState.guidedStep,guidedSteps.length-1)];document.querySelectorAll('[data-learning-mode]').forEach(function(b){var active=b.dataset.learningMode===labState.learningMode;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});var title=document.getElementById('learning-mode-title'),summary=document.getElementById('guided-step-summary'),next=document.getElementById('guided-next-button'),prog=document.getElementById('guided-progress');if(title)title.textContent=guided?labT('Guided','موجّه'):labT('Explore','استكشاف');if(summary)summary.textContent=guided?labT(step.en,step.ar):labT('Use the lab freely.','استخدم المختبر بحرية.');if(next)next.classList.toggle('hidden',!guided);if(prog){prog.classList.toggle('hidden',!guided);prog.setAttribute('aria-valuenow',String(labState.guidedStep+1));document.getElementById('guided-progress-bar').style.width=((labState.guidedStep+1)/guidedSteps.length*100)+'%';}}
function focusGuidedStep(){if(labState.learningMode!=='guided')return;var step=guidedSteps[Math.min(labState.guidedStep,guidedSteps.length-1)];switchTab(step.tab);setTimeout(function(){var el=document.getElementById(step.target);if(el){el.scrollIntoView({block:'center',behavior:motionBehavior()});var focus=el.matches('button,input,select,textarea')?el:el.querySelector('button,input,select,textarea,[tabindex]');if(focus)focus.focus({preventScroll:true});}},100);}
function advanceGuidedStep(){if(labState.guidedStep<guidedSteps.length-1)labState.guidedStep++;try{localStorage.setItem('agentlab.guidedStep',String(labState.guidedStep));}catch(_){}renderGuidedMode();focusGuidedStep();}
function nextIncompleteMission(){return LAB_MISSIONS.find(function(m){return !missionIsComplete(m.id);})||LAB_MISSIONS[LAB_MISSIONS.length-1];}
function continueLearning(){var m=nextIncompleteMission();openMissionTarget(m.id);}
function renderLearningHome(){var done=completedMissionCount(),pct=Math.round(done/LAB_MISSIONS.length*100),next=nextIncompleteMission();var set=function(id,text){var e=document.getElementById(id);if(e)e.textContent=text;};set('home-mastery',masteryLevelFor(done)+' · '+pct+'%');set('home-blueprint',agentBlueprint.name||'—');set('home-next-mission',labT(next.title[0],next.title[1]));set('home-last-run',labState.lastOutcome?(simulationStatusText(labState.lastOutcome.status)+' · '+labState.lastOutcome.scenario):labT('Not run yet','لم يتم التشغيل بعد'));set('home-trace',traceState.spans?.length?(traceState.spans.length+' '+labT('spans','مقاطع')):labT('No trace yet','لا يوجد تتبع بعد'));set('home-course',done+' / '+LAB_MISSIONS.length+' '+labT('competencies','كفاءات'));}

var oldAddOrch=addOrchestrationNode;addOrchestrationNode=function(){masteryState.orchestrationEdited=true;saveMastery();oldAddOrch();};
var oldConnectOrch=connectOrchestrationNodes;connectOrchestrationNodes=function(){masteryState.orchestrationEdited=true;saveMastery();oldConnectOrch();};
var oldRemoveOrch=removeOrchestrationNode;removeOrchestrationNode=function(id){masteryState.orchestrationEdited=true;saveMastery();oldRemoveOrch(id);};

var baseTranslateShellLab=translateShell;
translateShell=function(){baseTranslateShellLab();translateLab();renderMissions();renderMasteryProgress();};

var baseSwitchTabLab=switchTab;
switchTab=function(tabId){baseSwitchTabLab(tabId);if(tabId==='codestudio')generateCode();if(tabId==='trace')renderTraceInspector();if(tabId==='architecture')renderCustomOrchestration();if(tabId==='modules')renderLearningHome();};

var baseHighlightArchNodeLab=highlightArchNode;
highlightArchNode=function(nodeType){var info={client:{en:['01. Your application','Your application supplies user input and calls the Agents SDK. Nothing in this training HTML sends a live request.'],ar:['01. تطبيقك','يوفر تطبيقك مدخل المستخدم ويستدعي Agents SDK. هذا HTML التدريبي لا يرسل أي طلب حي.']},harness:{en:['02. Agents SDK Runner','Runner executes the agent loop around model calls, function tools, hosted tools, handoffs, guardrails, approvals, sessions and tracing.'],ar:['02. Runner في Agents SDK','يشغّل Runner حلقة Agent حول استدعاءات النموذج والأدوات والتسليم والضوابط والموافقات والجلسات والتتبع.']},environment:{en:['03. Session / RunState','A Session is a memory layer across runs. RunState represents a resumable interrupted run, including approval decisions.'],ar:['03. Session / RunState','Session طبقة ذاكرة عبر التشغيلات. يمثل RunState تشغيلاً متوقفاً يمكن استئنافه مع قرارات الموافقة.']},tools:{en:['04. Tools & delegation','Hosted tools, function tools, MCP, agents as tools and handoffs extend what the Agent can do. These are distinct SDK concepts.'],ar:['04. الأدوات والتفويض','توسع الأدوات المستضافة وFunction Tools وMCP والوكلاء كأدوات والتسليم قدرات Agent. وهي مفاهيم SDK منفصلة.']}};var x=info[nodeType];if(x){document.getElementById('arch-detail-title').textContent=labT(x.en[0],x.ar[0]);document.getElementById('arch-detail-desc').textContent=labT(x.en[1],x.ar[1]);}else baseHighlightArchNodeLab(nodeType);};

function wireLabControls(){
  ['function-tool-name','function-tool-description','function-approval-mode','function-approval-rule','function-simulated-result','mcp-server-label','mcp-transport','mcp-server-url','mcp-approval'].forEach(function(id){var el=document.getElementById(id);if(!el)return;el.addEventListener(el.tagName==='SELECT'?'change':'input',function(){if(id==='function-approval-mode')document.getElementById('function-approval-rule-wrap').classList.toggle('hidden',el.value!=='conditional');syncBlueprintFromBuilder();});});
  var out=document.getElementById('builder-output');if(out)out.addEventListener('change',renderStructuredDesignerVisibility);
  document.querySelectorAll('[data-builder-tool]').forEach(function(el){el.addEventListener('change',renderToolDesignerVisibility);});
  var scen=document.getElementById('sim-scenario');if(scen)scen.addEventListener('change',function(){var rc=document.getElementById('simulation-root-cause');if(rc){rc.classList.add('hidden');rc.innerHTML='';}});
}
function initializeEducationalLab(){
  hydrateBuilder();renderLearnDetails();renderFunctionArguments();renderOutputFields();renderToolDesignerVisibility();renderStructuredDesignerVisibility();renderFunctionSchema();renderOutputSchemaPreview();renderConfigurationViews();renderBadGoodTraining();renderCustomOrchestration();renderGuidedMode();renderLearningHome();wireLabControls();translateLab();generateCode();refreshMastery();lucide.createIcons();
}
document.addEventListener('DOMContentLoaded',initializeEducationalLab);
