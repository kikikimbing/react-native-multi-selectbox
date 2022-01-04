import React, { useState, memo, useMemo } from 'react'
import { isEmpty, find } from 'lodash'
import { View, FlatList, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import Colors from './src/constants/Colors'
import Icon from './src/components/Icon'
import Toggle from './src/components/Toggle'

const hitSlop = { top: 14, bottom: 14, left: 14, right: 14 }

const kOptionsHeight = { width: '100%', maxHeight: 180 }

const kOptionListViewStyle = {
  width: '100%',
  alignItems: 'center',
  paddingVertical: 4,
}
const renderItemStyle = { flexGrow: 5 }
const SelectBox = ({
  labelStyle,
  containerStyle,
  inputFilterContainerStyle,
  inputFilterStyle,
  optionsLabelStyle,
  optionContainerStyle,
  multiOptionContainerStyle,
  multiOptionsLabelStyle,
  multiListEmptyLabelStyle,
  listEmptyLabelStyle,
  selectedItemStyle,
  listEmptyText = 'No results found',
  ...props
}) => {
  const [inputValue, setInputValue] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  const renderLabel = (item) => {
    const kOptionsLabelStyle = {
      fontSize: 16,
      color: 'rgb(45, 61, 84)',
      ...optionsLabelStyle,
    }
    return <Text style={kOptionsLabelStyle}>{item}</Text>
  }

  const renderItem = ({ item }) => {
    const { isMulti, onChange, onMultiSelect, selectedValues } = props
    const kOptionContainerStyle = {
      borderColor: '#dadada',
      borderBottomWidth: 1,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      background: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      ...optionContainerStyle,
    }

    const onPressMultiItem = () => {
      return (e) => (onMultiSelect ? onMultiSelect(item) : null)
    }

    const onPressItem = () => {
      return (e) => {
        setShowOptions(false)
        return onChange ? onChange(item) : null
      }
    }

    return (
      <View style={kOptionContainerStyle}>
        {isMulti ? (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity hitSlop={hitSlop} style={renderItemStyle} onPress={onPressMultiItem()}>
              {renderLabel(item.item)}
            </TouchableOpacity>
            <Toggle
              iconColor={toggleIconColor}
              checked={selectedValues.some((i) => item.id === i.id)}
              onTouch={onPressMultiItem()}
            />
          </View>
        ) : (
          <>
            <TouchableOpacity hitSlop={hitSlop} style={renderItemStyle} onPress={onPressItem()}>
              {renderLabel(item.item)}
              <View />
            </TouchableOpacity>
          </>
        )}
      </View>
    )
  }

  const renderGroupItem = ({ item }) => {
    const { onTapClose, options } = props
    const label = find(options, (o) => o.id === item.id)
    const kMultiOptionContainerStyle = {
      height: 26,
      flexDirection: 'row',
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
      paddingVertical: 5,
      paddingRight: 10,
      paddingLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      flexGrow: 1,
      borderWidth: 1,
      borderColor: Colors.primaryDark,
      ...multiOptionContainerStyle,
    }
    const kMultiOptionContainerStyleIcon = {
      height: 26,
      flexDirection: 'row',
      borderTopRightRadius: 2,
      borderBottomRightRadius: 2,
      paddingVertical: 5,
      paddingHorizontal: 5,
      marginLeft: -1,
      marginRight: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      flexGrow: 1,
      borderWidth: 1,
      borderColor: Colors.primaryDark,
      ...multiOptionContainerStyle,
    }
    const kMultiOptionsLabelStyle = {
      fontSize: 14,
      lineHeight: 14 * 1.1,
      height: 14,
      color: '#fff',
      ...multiOptionsLabelStyle,
    }

    const onPressItem = () => {
      return (e) => (onTapClose ? onTapClose(item) : null)
    }

    return (
      <>
        <View style={kMultiOptionContainerStyle}>
          <Text style={kMultiOptionsLabelStyle}>{label.item}</Text>
        </View>
        <View style={kMultiOptionContainerStyleIcon}>
          <TouchableOpacity style={{}} hitSlop={hitSlop} onPress={onPressItem()}>
            <Icon name="closeCircle" fill="#fff" width={12} height={12} />
          </TouchableOpacity>
        </View>
      </>
    )
  }
  const {
    selectIcon,
    label,
    inputPlaceholder = 'Select',
    hideInputFilter,
    width = '100%',
    isMulti,
    options,
    value,
    selectedValues,
    arrowIconColor = Colors.primary,
    searchIconColor = Colors.primary,
    toggleIconColor = Colors.primary,
    searchInputProps,
    multiSelectInputFieldProps,
    listOptionProps = {},
  } = props
  const filteredSuggestions = useMemo(
    () => options.filter((suggestion) => suggestion.item.toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
    [inputValue, options]
  )

  const multiListEmptyComponent = () => {
    const kMultiListEmptyLabelStyle = {
      fontSize: 17,
      color: 'rgba(60, 60, 67, 0.3)',
      ...multiListEmptyLabelStyle,
    }
    return (
      <TouchableOpacity
        width="100%"
        style={{ flexGrow: 1, width: '100%' }}
        hitSlop={hitSlop}
        onPress={onPressShowOptions()}>
        <Text style={kMultiListEmptyLabelStyle}>{inputPlaceholder}</Text>
      </TouchableOpacity>
    )
  }

  const optionListEmpty = () => {
    const kListEmptyLabelStyle = {
      fontSize: 17,
      color: 'rgba(60, 60, 67, 0.6)',
      ...listEmptyLabelStyle,
    }
    return (
      <View style={kOptionListViewStyle}>
        <Text style={kListEmptyLabelStyle}>{listEmptyText}</Text>
      </View>
    )
  }
  const kLabelStyle = {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    paddingBottom: 4,
    ...labelStyle,
  }

  const kContainerStyle = {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#ddd',
    paddingTop: 6,
    paddingRight: 20,
    paddingBottom: 8,
    ...containerStyle,
  }

  const keyExtractor = () => {
    return (o) => `${o.id}-${Math.random()}`
  }

  const kSelectedItemStyle = () => {
    return {
      fontSize: 17,
      color: isEmpty(value.item) ? 'rgba(60, 60, 67, 0.3)' : '#000',
      ...selectedItemStyle,
    }
  }

  const onPressShowOptions = () => {
    return () => setShowOptions(!showOptions)
  }

  const HeaderComponent = () => {
    const kInputFilterContainerStyle = {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 18,
      justifyContent: 'space-between',
      ...inputFilterContainerStyle,
    }
    const kInputFilterStyle = {
      paddingVertical: 14,
      paddingRight: 8,
      color: '#000',
      fontSize: 12,
      flexGrow: 1,
      ...inputFilterStyle,
    }
    return (
      <>
        {!hideInputFilter && (
          <View style={kInputFilterContainerStyle}>
            <TextInput
              value={inputValue}
              placeholder={inputPlaceholder}
              onChangeText={onChangeText()}
              style={kInputFilterStyle}
              placeholderTextColor="#000"
              {...searchInputProps}
            />
            <Icon name="searchBoxIcon" fill={searchIconColor} />
          </View>
        )}
        <ScrollView keyboardShouldPersistTaps="always" />
      </>
    )

    function onChangeText() {
      return (value) => setInputValue(value)
    }
  }

  return (
    <>
      <View style={{ width }}>
        <Text style={kLabelStyle}>{label}</Text>
        <View style={kContainerStyle}>
          <View style={{ paddingRight: 20, flexGrow: 1 }}>
            {isMulti ? (
              <FlatList
                data={selectedValues}
                extraData={{ inputValue, showOptions }}
                keyExtractor={keyExtractor()}
                renderItem={renderGroupItem}
                horizontal={true}
                ListEmptyComponent={multiListEmptyComponent}
                {...multiSelectInputFieldProps}
              />
            ) : (
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressShowOptions()}>
                <Text style={kSelectedItemStyle()}>{value.item || inputPlaceholder || label}</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={onPressShowOptions()} hitSlop={hitSlop}>
            {selectIcon ? selectIcon : <Icon name={showOptions ? 'upArrow' : 'downArrow'} fill={arrowIconColor} />}
          </TouchableOpacity>
        </View>
        {/* Options wrapper */}
        {showOptions && (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}>
            <FlatList
              data={filteredSuggestions || options}
              extraData={options}
              keyExtractor={keyExtractor()}
              renderItem={renderItem}
              numColumns={1}
              horizontal={false}
              initialNumToRender={5}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={optionListEmpty}
              style={[kOptionsHeight, listOptionProps.style]}
              // ListHeaderComponent={HeaderComponent()}
              {...listOptionProps}
            />
          </View>
        )}
      </View>
    </>
  )
}

SelectBox.defaultProps = {
  label: 'Label',
  options: [
    {
      item: 'Aston Villa FC',
      id: 'AVL',
    },
    {
      item: 'West Ham United FC',
      id: 'WHU',
    },
    {
      item: 'Stoke City FC',
      id: 'STK',
    },
    {
      item: 'Sunderland AFC',
      id: 'SUN',
    },
    {
      item: 'Everton FC',
      id: 'EVE',
    },
    {
      item: 'Tottenham Hotspur FC',
      id: 'TOT',
    },
    {
      item: 'Manchester City FC',
      id: 'MCI',
    },
    {
      item: 'Chelsea FC',
      id: 'CHE',
    },
    {
      item: 'West Bromwich Albion FC',
      id: 'WBA',
    },
    {
      item: 'Liverpool FC',
      id: 'LIV',
    },
    {
      item: 'Arsenal FC',
      id: 'ARS',
    },
    {
      item: 'Manchester United FC',
      id: 'MUN',
    },
    {
      item: 'Newcastle United FC',
      id: 'NEW',
    },
    {
      item: 'Norwich City FC',
      id: 'NOR',
    },
    {
      item: 'Watford FC',
      id: 'WAT',
    },
    {
      item: 'Swansea City FC',
      id: 'SWA',
    },
    {
      item: 'Crystal Palace FC',
      id: 'CRY',
    },
    {
      item: 'Leicester City FC',
      id: 'LEI',
    },
    {
      item: 'Southampton FC',
      id: 'SOU',
    },
    {
      item: 'AFC Bournemouth',
      id: 'BOU',
    },
  ],
}

export default memo(SelectBox)
