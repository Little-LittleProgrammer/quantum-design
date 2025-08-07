import Moveable from 'moveable';

export class DragHelper {
    private moveable: Moveable;
    private container: HTMLElement;
    private target: HTMLElement;
    customBounds = {
        x: 0,
        y: 0
    };

    constructor(container: HTMLElement, target: HTMLElement, options?: {
        customBounds: {
            x: number;
            y: number;
        };
    }) {
        this.container = container;
        this.target = target;
        this.initMoveable(container, target);
        if (options && options.customBounds) {
            this.customBounds = options.customBounds;
        }
    }

    initMoveable(container: HTMLElement, target: HTMLElement) {
        this.clear();
        this.moveable = new Moveable(container, {
            target: target,
            draggable: true,
            resizable: false,
            rotatable: false,
            scalable: false,
            origin: false,
            zoom: 0,
            bounds: this.getBounds()
        });
        this.bindDragEvent();
        this.initResizeObserver();
    }

    private getBounds() {
        const containerRect = this.container.getBoundingClientRect();
        const targetRect = this.target.getBoundingClientRect();
        return {
            left: 0,
            top: 0,
            right: containerRect.width - targetRect.width - this.customBounds.x,
            bottom: containerRect.height - targetRect.height - this.customBounds.y
        };
    }

    private clampPosition(x: number, y: number) {
        const bounds = this.getBounds();
        return {
            x: Math.max(bounds.left, Math.min(bounds.right, x)),
            y: Math.max(bounds.top, Math.min(bounds.bottom, y))
        };
    }

    bindDragEvent() {
        if (!this.moveable) return;

        this.moveable.on('drag', ({ target, left, top }) => {
            const clampedPosition = this.clampPosition(left, top);
            target.style.left = `${clampedPosition.x}px`;
            target.style.top = `${clampedPosition.y}px`;
        });
    }

    initResizeObserver() {
        const observer = new ResizeObserver(() => {
            const bounds = this.getBounds();
            const dom = this.target;
            if (Number.parseFloat(dom.style.left) > bounds.right) {
                dom.style.left = `${bounds.right}px`;
            }
            if (Number.parseFloat(dom.style.top) > bounds.bottom) {
                dom.style.top = `${bounds.bottom}px`;
            }
            this.moveable.updateRect();
        });
        observer.observe(this.container);
    }

    clear() {
        if (this.moveable) {
            this.moveable.destroy();
        }
    }
}
