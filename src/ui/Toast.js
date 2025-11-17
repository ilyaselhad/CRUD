export class Toast {
    static success(msg){ Toast.show(msg, '#28a745')}
    static error(msg){ Toast.show(msg, '#fb0505ff')}
    static info(msg){ Toast.show(msg, '#210feeff')}
    // Auto-remove after 3 seconds
    // Stackable and styled
    static container(){
        let c = document.querySelector('.toast-element');
        if(!c){
            c = document.createElement("div");
            c.className = 'toast-element';
            Object.assign(c.style , {
                position : 'fixed',
                top : '15px',
                right : '10px',
                zIndex : '1'
            });
            document.body.appendChild(c)
        }
        return c;
    }
    static show(msg, color='#111'){
        let c = Toast.container();
        let e = document.createElement("div");
        e.textContent = msg;
        Object.assign(e.style , {
            margin: '6px 0',
            padding: '10px 14px',
            background: '#fff',
            //borderTop: `6px solid ${color}`,
            backgroundImage: `linear-gradient(to top right, ${color} , transparent )`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            minWidth: '200px',
            fontSize: '14px'
        });
        c.appendChild(e);
        setTimeout(() => {
            e.style.transition = 'opacity 0.3s';
            e.style.opacity = '0';
            setTimeout(() => e.remove(),300);
        },3000);
    }
}