let innerHTML = `<div class="timeline">
    <div class="timeline-block">
        <div class="indicator-container">
            <div class="indicator complete"></div>
        </div>
        <div class="date">X</div>
    </div>

    <div class="timeline-block">
        <div class="indicator-container">
            <div class="indicator processing"></div>
        </div>
        <div class="content">
            <div class="sub-heading">Y</div>
        </div>
        <div class="date">Y</div>
    </div>

    <div class="timeline-block">
        <div class="indicator-container">
            <div class="indicator"></div>
        </div>
        <div class="content">
            <div class="heading">Z</div>
        </div>
        <div class="date">Z</div>
    </div>

    <div class="timeline-block">
        <div class="indicator-container">
            <div class="indicator"></div>
        </div>
        <div class="content">
            <div class="heading">Z2</div>
        </div>
        <div class="date">Z2</div>
    </div>

</div>
`;

export class SohoTimeline extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = innerHTML;
		$(this).initialize();
	}
}
