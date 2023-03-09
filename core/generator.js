// 生成器
import { isNotNull } from "./utils.js";
// 容器组件属性
const containerTemplates = {  
  'grid': (ctn) => {
    const gridClassAttr = buildClassAttr(ctn)
    const gridTemplate =
      `<el-row ${gridClassAttr}>
${ctn.cols.map(col => {
        const colOpt = col.options
        const spanAttr = !!colOpt.responsive ? '' : `:span="${colOpt.span}"`
        const mdAttr = !colOpt.responsive ? '' : `:md="${colOpt.md}"`
        const smAttr = !colOpt.responsive ? '' : `:sm="${colOpt.sm}"`
        const xsAttr = !colOpt.responsive ? '' : `:xs="${colOpt.xs}"`
        const offsetAttr = !!colOpt.offset ? `:offset="${colOpt.offset}"` : ''
        const pushAttr = !!colOpt.push ? `:push="${colOpt.push}"` : ''
        const pullAttr = !!colOpt.pull ? `:pull="${colOpt.pull}"` : ''
        const colClassAttr = buildClassAttr(col, 'grid-cell')
        return `<el-col ${spanAttr} ${mdAttr} ${smAttr} ${xsAttr} ${offsetAttr} ${pushAttr} ${pullAttr} ${colClassAttr}>
    ${col.widgetList.map(cw => {
          if (cw.category === 'container') {
            return buildContainerWidget(cw)
          } else {
            return buildFieldWidget(cw)
          }
        }).join('')
          }
    </el-col>`
      }).join('')
      }
</el-row>`

    return gridTemplate
  },

  'table': (ctn) => {
    const tableClassAttr = buildClassAttr(ctn, 'table-layout')
    const tableTemplate =
      `<div class="table-container">
  <table ${tableClassAttr}><tbody>
  ${ctn.rows.map(tr => {
        return `<tr>${tr.cols.filter(td => !td.merged).map(td => {
          const tdOpt = td.options
          const tdClassAttr = buildClassAttr(td, 'table-cell')
          const colspanAttr = (!isNaN(tdOpt.colspan) && (tdOpt.colspan !== 1)) ? `colspan="${tdOpt.colspan}"` : ''
          const rowspanAttr = (!isNaN(tdOpt.rowspan) && (tdOpt.rowspan !== 1)) ? `rowspan="${tdOpt.rowspan}"` : ''

          let tdStyleArray = []
          !!tdOpt.cellWidth && tdStyleArray.push('width: ' + tdOpt.cellWidth + ' !important')
          !!tdOpt.cellHeight && tdStyleArray.push('height: ' + tdOpt.cellHeight + ' !important')
          let tdStyleAttr = (tdStyleArray.length > 0) ? `style="${tdStyleArray.join(';')}"` : ''

          return `<td ${tdClassAttr} ${colspanAttr} ${rowspanAttr} ${tdStyleAttr}>${td.widgetList.map(tw => {
            if (tw.category === 'container') {
              return buildContainerWidget(tw)
            } else {
              return buildFieldWidget(tw)
            }
          }).join('')
            }
                    </td>`
        }).join('')
          }</tr>`
      }).join('')
      }
  </tbody></table>
</div>`
    return tableTemplate
  },

  'tab': (ctn) => {
    const tabClassAttr = buildClassAttr(ctn)
    const vModel = ctn.tabs && (ctn.tabs.length > 0) ? `v-model="${ctn.options.name}ActiveTab"` : ''
    const tabTemplate =
      `<div class="tab-container">
  <el-tabs ${vModel} type="${ctn.displayType}" ${tabClassAttr}>
    ${ctn.tabs.map(tab => {
        const tabOpt = tab.options
        const disabledAttr = (tabOpt.disabled === true) ? `disabled` : ''
        return `<el-tab-pane name="${tabOpt.name}" label="${tabOpt.label}" ${disabledAttr}>
        ${tab.widgetList.map(tw => {
          if (tw.category === 'container') {
            return buildContainerWidget(tw)
          } else {
            return buildFieldWidget(tw)
          }
        }).join('')
          }</el-tab-pane>`
      }).join('')}
  </el-tabs>
</div>`

    return tabTemplate
  },

  'sub-form': (ctn) => {
    const submitAttr = `@submit.prevent`
    const tabTemplate =
      `<div class="sub-form-container">
        <form  
          :model="${ctn.options.modelName}" 
          ref="${ctn.options.refName}" 
          :rules="${ctn.options.rulesName}"
          label-position="${ctn.options.labelPosition}" 
          label-width="${ctn.options.labelWidth || 0}px" 
          size="${ctn.options.size || 'default'}"
          ${submitAttr}>
          ${ctn.widgetList.map(tw => {
        if (tw.category === 'container') {
          return buildContainerWidget(tw)
        } else {
          return buildFieldWidget(tw)
        }
      }).join('')}
        </form>
      </div>`

    return tabTemplate
  },
}
// 字段组件属性
const elTemplates = {  
  'input': (widget, formConfig) => {
    const { vModel, readonly, disabled, size, type, showPassword, placeholder, clearable,
      minlength, maxlength, showWordLimit, prefixIcon, suffixIcon, appendButtonChild } = getElAttrs(widget, formConfig)
    return `<el-input ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder} ${clearable}
            ${minlength} ${maxlength} ${showWordLimit} ${prefixIcon} ${suffixIcon}>${appendButtonChild}</el-input>`
  },

  'textarea': (widget, formConfig) => {
    const { vModel, readonly, disabled, size, type, showPassword, placeholder, rows, clearable,
      minlength, maxlength, showWordLimit } = getElAttrs(widget, formConfig)
    return `<el-input type="textarea" ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder}
            ${rows} ${clearable} ${minlength} ${maxlength} ${showWordLimit}></el-input>`
  },

  'number': (widget, formConfig) => {
    const { vModel, disabled, size, type, showPassword, placeholder, controlsPosition, min, max, precision, step
    } = getElAttrs(widget, formConfig)
    return `<el-input-number ${vModel} class="full-width-input" ${disabled} ${size} ${type} ${showPassword}
            ${placeholder} ${controlsPosition} ${min} ${max} ${precision} ${step}></el-input-number>`
  },

  'radio': (widget, formConfig) => {
    const { vModel, disabled, size } = getElAttrs(widget, formConfig)
    const radioOptions = buildRadioChildren(widget, formConfig)
    return `<el-radio-group ${vModel} ${disabled} ${size}>${radioOptions}</el-radio-group>`
  },

  'checkbox': (widget, formConfig) => {
    const { vModel, disabled, size } = getElAttrs(widget, formConfig)
    const checkboxOptions = buildCheckboxChildren(widget, formConfig)
    return `<el-checkbox-group ${vModel} ${disabled} ${size}>${checkboxOptions}</el-checkbox-group>`
  },

  'select': (widget, formConfig) => {
    const { vModel, disabled, size, clearable, filterable, allowCreate, defaultFirstOption, automaticDropdown,
      multiple, multipleLimit, remote, placeholder } = getElAttrs(widget, formConfig)
    const selectOptions = buildSelectChildren(widget, formConfig)
    return `<el-select ${vModel} class="full-width-input" ${disabled} ${size} ${clearable} ${filterable}
            ${allowCreate} ${defaultFirstOption} ${automaticDropdown} ${multiple} ${multipleLimit} ${placeholder}
            ${remote}>${selectOptions}</el-select>`
  },

  'time': (widget, formConfig) => {
    const { vModel, readonly, disabled, size, placeholder, clearable, format, editable
    } = getElAttrs(widget, formConfig)
    return `<el-time-picker ${vModel} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            value-format="HH:mm:ss" ${placeholder} ${clearable} ${editable}></el-time-picker>`
  },

  'time-range': (widget, formConfig) => {
    const { vModel, readonly, disabled, size, startPlaceholder, endPlaceholder, clearable, format, editable
    } = getElAttrs(widget, formConfig)
    return `<el-time-picker is-range ${vModel} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            value-format="HH:mm:ss" ${startPlaceholder} ${endPlaceholder} ${clearable} ${editable}></el-time-picker>`
  },

  'date': (widget, formConfig) => {
    const { vModel, readonly, disabled, size, type, placeholder, clearable, format, valueFormat, editable
    } = getElAttrs(widget, formConfig)
    return `<el-date-picker ${vModel} ${type} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
              ${valueFormat} ${placeholder} ${clearable} ${editable}></el-date-picker>`
  },

  'date-range': (widget, formConfig) => {
    const { vModel, readonly, disabled, size, type, startPlaceholder, endPlaceholder, clearable, format, valueFormat, editable
    } = getElAttrs(widget, formConfig)
    return `<el-date-picker is-range ${vModel} ${type} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            ${valueFormat} ${startPlaceholder} ${endPlaceholder} ${clearable} ${editable}></el-date-picker>`
  },

  'switch': (widget, formConfig) => {
    const { vModel, disabled, activeText, inactiveText, activeColor, inactiveColor, switchWidth
    } = getElAttrs(widget, formConfig)
    return `<el-switch ${vModel} ${disabled} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor}
            ${switchWidth}></el-switch>`
  },

  'rate': (widget, formConfig) => {
    const { vModel, disabled, rateMax, lowThreshold, highThreshold, allowHalf, showText,
      showScore } = getElAttrs(widget, formConfig)
    return `<el-rate ${vModel} ${disabled} ${rateMax} ${lowThreshold} ${highThreshold} ${allowHalf}
            ${showText} ${showScore}></el-rate>`
  },

  'color': (widget, formConfig) => {
    const { vModel, disabled, size
    } = getElAttrs(widget, formConfig)
    return `<el-color-picker ${vModel} ${disabled} ${size}></el-color-picker>`
  },

  'slider': (widget, formConfig) => {
    const { vModel, disabled, sliderMin, sliderMax, sliderStep, sliderRange, sliderVertical
    } = getElAttrs(widget, formConfig)
    return `<el-slider ${vModel} ${disabled} ${sliderMin} ${sliderMax} ${sliderStep} ${sliderRange}
            ${sliderVertical}></el-slider>`
  },

  'picture-upload': (widget, formConfig) => {
    const { vModel, disabled, uploadAction, withCredentials, multipleSelect, showFileList, limit,
      uploadTipSlotChild, pictureUploadIconChild } = getElAttrs(widget, formConfig)
    let wop = widget.options
    return `<el-upload :file-list="${wop.name}FileList" :headers="${wop.name}UploadHeaders" :data="${wop.name}UploadData" 
            ${disabled} ${uploadAction} list-type="picture-card" ${withCredentials} ${multipleSelect} ${showFileList} 
            ${limit}>${uploadTipSlotChild} ${pictureUploadIconChild}</el-upload>`
  },

  'file-upload': (widget, formConfig) => {
    const { vModel, disabled, uploadAction, withCredentials, multipleSelect, showFileList, limit,
      uploadTipSlotChild, fileUploadIconChild } = getElAttrs(widget, formConfig)
    let wop = widget.options
    return `<el-upload :file-list="${wop.name}FileList" :headers="${wop.name}UploadHeaders" :data="${wop.name}UploadData" 
            ${disabled} ${uploadAction} list-type="picture-card" ${withCredentials} ${multipleSelect} ${showFileList} 
            ${limit}>${uploadTipSlotChild} ${fileUploadIconChild}</el-upload>`
  },

  'rich-editor': (widget, formConfig) => {
    const { vModel, disabled, placeholder
    } = getElAttrs(widget, formConfig)
    return `<vue-editor ${vModel} ${disabled} ${placeholder}></vue-editor>`
  },

  'cascader': (widget, formConfig) => {
    const { vModel, disabled, size, clearable, filterable, placeholder } = getElAttrs(widget, formConfig)
    let wop = widget.options
    const optionsAttr = `:options="${wop.name}Options"`
    return `<el-cascader ${vModel} class="full-width-input" ${optionsAttr} ${disabled} ${size} ${clearable}
            ${filterable} ${placeholder}></el-cascader>`
  },

  'static-text': (widget, formConfig) => {
    return `<div>${widget.options.textContent}</div>`
  },

  'html-text': (widget, formConfig) => {
    return `<div v-html="${widget.options.htmlContent}"></div>`
  },

  'button': (widget, formConfig) => {
    const { buttonType, buttonPlain, buttonRound, buttonCircle, buttonIcon, disabled } = getElAttrs(widget, formConfig)
    return `<el-button ${buttonType} ${buttonPlain} ${buttonRound} ${buttonCircle} ${buttonIcon}
            ${disabled}>${widget.options.label}</el-button>`
  },

  'divider': (widget, formConfig) => {
    const { contentPosition } = getElAttrs(widget, formConfig)
    return `<el-divider direction="horizontal" ${contentPosition}></el-divider>`
  },

}
// 获取El组件属性
function getElAttrs (widget, formConfig) {  
  let wop = widget.options
  return {
    vModel: `v-model="form.${wop.name}"`, // 
    readonly: wop.readonly ? `readonly="true"` : '',
    disabled: wop.disabled ? `:disabled="true"` : '',
    size: !!wop.size ? `size="${wop.size}"` : '',
    type: !!wop.type ? `type="${wop.type === 'number' ? 'text' : wop.type}"` : '',
    showPassword: !!wop.showPassword ? `:show-password="${wop.showPassword}"` : '',
    placeholder: !!wop.placeholder ? `placeholder="${wop.placeholder}"` : '',
    rows: (isNotNull(wop.rows) && !isNaN(wop.rows)) ? `rows="${wop.rows}"` : '',
    clearable: !!wop.clearable ? 'clearable' : '',
    minlength: (isNotNull(wop.minLength) && !isNaN(wop.minLength)) ? `:minlength="${wop.minLength}"` : '',
    maxlength: (isNotNull(wop.maxLength) && !isNaN(wop.maxLength)) ? `:maxlength="${wop.maxLength}"` : '',
    showWordLimit: !!wop.showWordLimit ? `:show-word-limit="true"` : '',
    prefixIcon: !!wop.prefixIcon ? `prefix-icon="${wop.prefixIcon}"` : '',
    suffixIcon: !!wop.suffixIcon ? `suffix-icon="${wop.suffixIcon}"` : '',
    controlsPosition: wop.controlsPosition === 'right' ? `controls-position="right"` : '',
    min: (isNotNull(wop.min) && !isNaN(wop.min)) ? `:min="${wop.min}"` : '',
    max: (isNotNull(wop.max) && !isNaN(wop.max)) ? `:max="${wop.max}"` : '',
    precision: (isNotNull(wop.precision) && !isNaN(wop.precision)) ? `:precision="${wop.precision}"` : '',
    step: (isNotNull(wop.step) && !isNaN(wop.step)) ? `:step="${wop.step}"` : '',
    filterable: !!wop.filterable ? `filterable` : '',
    allowCreate: !!wop.allowCreate ? `allow-create` : '',
    defaultFirstOption: (!!wop.filterable && !!wop.allowCreate) ? `default-first-option` : '',
    multiple: !!wop.multiple ? `multiple` : '',
    multipleLimit: (!isNaN(wop.multipleLimit) && (wop.multipleLimit > 0)) ? `:multiple-limit="${wop.multipleLimit}"` : '',
    automaticDropdown: !!wop.automaticDropdown ? `automatic-dropdown` : '',
    remote: !!wop.remote ? `remote` : '',
    format: !!wop.format ? `format="${wop.format}"` : '',
    valueFormat: !!wop.valueFormat ? `value-format="${wop.valueFormat}"` : '',
    editable: !!wop.editable ? `:editable="${wop.editable}"` : '',
    startPlaceholder: !!wop.startPlaceholder ? `start-placeholder="${wop.startPlaceholder}"` : '',
    endPlaceholder: !!wop.endPlaceholder ? `end-placeholder="${wop.endPlaceholder}"` : '',

    activeText: !!wop.activeText ? `active-text="${wop.activeText}"` : '',
    inactiveText: !!wop.inactiveText ? `inactive-text="${wop.inactiveText}"` : '',
    activeColor: !!wop.activeColor ? `active-color="${wop.activeColor}"` : '',
    inactiveColor: !!wop.inactiveColor ? `inactive-color="${wop.inactiveColor}"` : '',
    switchWidth: (!isNaN(wop.switchWidth) && (wop.switchWidth !== 40)) ? `:width="${wop.switchWidth}"` : '',

    rateMax: (!isNaN(wop.max) && (wop.max !== 5)) ? `:max="${wop.max}"` : '',
    lowThreshold: (!isNaN(wop.lowThreshold) && (wop.lowThreshold !== 2)) ? `:low-threshold="${wop.lowThreshold}"` : '',
    highThreshold: (!isNaN(wop.highThreshold) && (wop.highThreshold !== 4)) ? `:high-threshold="${wop.highThreshold}"` : '',
    allowHalf: !!wop.allowHalf ? `allow-half` : '',
    showText: !!wop.showText ? `show-text` : '',
    showScore: !!wop.showScore ? `show-score` : '',

    sliderMin: (!isNaN(wop.min) && (wop.min !== 0)) ? `:min="${wop.min}"` : '',
    sliderMax: (!isNaN(wop.max) && (wop.max !== 100)) ? `:max="${wop.max}"` : '',
    sliderStep: (!isNaN(wop.step) && (wop.step !== 1)) ? `:step="${wop.step}"` : '',
    sliderRange: !!wop.range ? `range` : '',
    sliderVertical: !!wop.vertical ? `vertical` : '',

    uploadAction: !!wop.uploadURL ? `action="${wop.uploadURL}"` : '',
    withCredentials: !!wop.withCredentials ? `with-credentials` : '',
    multipleSelect: !!wop.multipleSelect ? `multiple` : '',
    showFileList: !!wop.showFileList ? `show-file-list` : '',
    limit: !isNaN(wop.limit) ? `:limit="${wop.limit}"` : '',
    uploadTipSlotChild: !!wop.uploadTip ? `<template #tip><div class="el-upload__tip">${wop.uploadTip}</div></template>` : '',
    pictureUploadIconChild: `<template #default><i class="el-icon-plus"></i></template>`,
    fileUploadIconChild: `<template #default><i class="el-icon-plus"></i></template>`,

    buttonType: !!wop.type ? `type="${wop.type}"` : '',
    buttonPlain: !!wop.plain ? `plain` : '',
    buttonRound: !!wop.round ? `round` : '',
    buttonCircle: !!wop.circle ? `circle` : '',
    buttonIcon: !!wop.icon ? `icon="${wop.icon}"` : '',

    contentPosition: (!!wop.contentPosition && (wop.contentPosition !== 'center')) ? `content-position="${wop.contentPosition}"` : '',

    appendButtonChild: !!wop.appendButton ? `<template #append><el-button class="${wop.buttonIcon}" ${!!wop.appendButtonDisabled ? 'disabled' : ''}></el-button></template>` : '',
  }
}

// 获得vue模板
export function getTemplate (widgetList) {
  let childrenList = []
  widgetList.forEach(wgt => {
    if (wgt.category === 'container') {
      childrenList.push(buildContainerWidget(wgt))
    } else {
      childrenList.push(buildFieldWidget(wgt))
    }
  })
  const formTemplate =
    `${childrenList.length ? childrenList.join('\n') : ''}`

  return formTemplate
}

// 构建容器组件
function buildContainerWidget (widget) {
  return containerTemplates[widget.type] ? containerTemplates[widget.type](widget) : null
}
// 构建基础组件
function buildFieldWidget (widget) {
  let wop = widget.options
  const label = wop.labelHidden ? '' : wop.label
  const labelWidthAttr = wop.labelHidden ? `label-width="0"` : (!!wop.labelWidth ? `label-width="${wop.labelWidth}px"` : '')
  const labelTooltipAttr = wop.labelTooltip ? `title="${wop.labelTooltip}"` : ''
  const propAttr = `prop="${wop.name}"`

  let classArray = []
  !!wop.required && classArray.push('required')
  !!wop.customClass && (wop.customClass.length > 0) && classArray.push(wop.customClass.join(' '))
  if (!!wop.labelAlign) {
    wop.labelAlign !== 'label-left-align' && classArray.push(wop.labelAlign)
  } else if (!!widget.formItemFlag) {
  }
  if (!widget.formItemFlag) {
    classArray.push('static-content-item')
  }
  const classAttr = (classArray.length > 0) ? `class="${classArray.join(' ')}"` : ''

  let customLabelDom =
    `<template #label><span class="custom-label">${wop.labelIconPosition === 'front' ?
      (!!wop.labelTooltip ?
        `<el-tooltip content="${wop.labelTooltip}" effect="light"><i class="${wop.labelIconClass}"></i></el-tooltip>${wop.label}` :
        `<i class="${wop.labelIconClass}"></i>${wop.label}`
      )
      :
      (!!wop.labelTooltip ?
        `${wop.label}<el-tooltip content="${wop.labelTooltip}" effect="light"><i class="${wop.labelIconClass}"></i></el-tooltip>` :
        `${wop.label}<i class="${wop.labelIconClass}"></i>`
      )
    }
</span></template>`
  !wop.labelIconClass && (customLabelDom = '')

  const fwDom = elTemplates[widget.type] ? elTemplates[widget.type](widget) : null
  const isFormItem = !!widget.formItemFlag
  const vShowAttr = !!wop.hidden ? `v-show="false"` : ''
  return isFormItem ?
    `<el-form-item label="${label}" ${labelWidthAttr} ${labelTooltipAttr} ${propAttr} ${classAttr}>
  ${customLabelDom}
  ${fwDom}
</el-form-item>`
    :
    `<div ${classAttr} ${vShowAttr}>${fwDom}</div>`
}