const DropdownWidget =  function(args) {

    const typeBody = args.annotation ?
        args.annotation.bodies.find(function(b) {
            return b.type === 'ImageType';
        }) : null;

    const typeSelected = typeBody ? typeBody.value : "";

    const addTag = function(evt) {
        if (typeBody) {
            args.onUpdateBody(typeBody, {
                type: 'ImageType',
                value: evt.target.value
            });
        } else {
            args.onAppendBody({
                type: 'ImageType',
                value: evt.target.value
            });
        }
    }

    const select = document.createElement('select');
    select.className = 'form-select';
    select.addEventListener('change', addTag);

    function createOption(props) {
        const option = document.createElement('option');
        if (typeSelected === props.value) {
            option.selected = true;
        }
        for (const key of Object.keys(props)) {
            option[key] = props[key];
        }
        return option;
    }

    select.appendChild(createOption({value: "", disabled: true, text: "Select vehicle"}));
    select.appendChild(createOption({value: "car", text: "car"}));
    select.appendChild(createOption({value: "bus", text: "bus"}));
    select.appendChild(createOption({value: "autorickshaw", text: "autorickshaw"}));
    select.appendChild(createOption({value: "bike", text: "bike"}));

    return select;
}

export default DropdownWidget;
