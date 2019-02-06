let innerHTML = `<div class="wizard">
<div class="wizard-header">
  <div class="bar">
    <div class="completed-range"></div>
    <div class="tick complete">
      <span class="label">Learn Grammar</span>
    </div>
    <div class="tick complete">
      <span class="label">Codify Rules</span>
    </div>
    <div class="tick current">
      <span class="label">Learn Spanish</span>
    </div>
    <div class="tick">
      <span class="label">Add Vocabulary</span>
    </div>
  </div>
</div>
</div>`;

export class SohoWizard extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = innerHTML;
		$(this).initialize();
	}
}
