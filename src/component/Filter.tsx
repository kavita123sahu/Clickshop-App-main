import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { Colors } from '../common/Colors';

interface FilterData {
    id: number;
    title?: string;
    name?: string;
}

interface Props {
    filterId: number;
    closeModal: () => void;
    onApplyFilter: any,
    onClearFilter: any,
    onApplySort: any,
    onResetSort: any
}

interface FilterProps {
    filterId: number;
    closeModal: () => void;
    onApplyFilter: (minPrice: string, maxPrice: string) => void;
    onClearFilter: () => void;
    onApplySort: (sortBy: string, order: string) => void;
    onResetSort: () => void;
    currentFilters: {
        priceRange?: { min: string; max: string };
        sortBy?: { field: string; order: string };
    };
}

const Filter: React.FC<FilterProps> = ({
    filterId,
    closeModal,
    onApplyFilter,
    onClearFilter,
    onApplySort,
    onResetSort,
    currentFilters
}) => {
    const [filterData] = useState<FilterData[]>([
        { id: 1, title: 'Price' },
    ]);

    const [filterTitle, setFilterTitle] = useState<string>('Price');
    const [priceItemId, setPriceItemId] = useState<number | undefined>();
    const [sortId, setSortId] = useState<number | undefined>();

    const priceData: FilterData[] = [
        { id: 1, name: '0-200' },
        { id: 2, name: '200-500' },
        { id: 3, name: '500-1000' },
        { id: 4, name: 'over 1000' }
    ];

    const sortByData: FilterData[] = [
        { id: 1, name: 'Most popular' },
        { id: 2, name: 'Price: High to Low' },
        { id: 3, name: 'Price: Low to High' },
        { id: 4, name: 'Bestseller' },
    ];


    useEffect(() => {
        if (currentFilters.priceRange) {
            const { min, max } = currentFilters.priceRange;
            if (min === '0' && max === '200') setPriceItemId(1);
            else if (min === '200' && max === '500') setPriceItemId(2);
            else if (min === '500' && max === '1000') setPriceItemId(3);
            else if (min === '1000') setPriceItemId(4);
        }

        if (currentFilters.sortBy) {
            const { field, order } = currentFilters.sortBy;
            if (field === 'rating') setSortId(1);
            else if (field === 'unit_price' && order === 'desc') setSortId(2);
            else if (field === 'unit_price' && order === 'asc') setSortId(3);
            else if (field === 'num_of_sale') setSortId(4);
        }
    }, [currentFilters]);

    const renderFilterData: ListRenderItem<FilterData> = ({ item }) => (
        <TouchableOpacity
            style={{ flex: 1, marginVertical: 8 }}
            onPress={() => {
                setFilterTitle(item.title || '');
            }}
        >
            <Text style={{
                color: filterTitle === item.title ? Colors.textColor : Colors.blackColor50,
                fontWeight: filterTitle === item.title ? 'bold' : 'normal',
                fontSize: 16
            }}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    const renderPriceData: ListRenderItem<FilterData> = ({ item }) => (
        <TouchableOpacity
            onPress={() => setPriceItemId(item.id)}
            style={{ flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.greyBorder }}
        >
            <MaterialCommunityIcons
                name={priceItemId === item.id ? 'checkbox-intermediate' : 'checkbox-blank-outline'}
                size={24}
                color={Colors.orangeColor}
            />
            <View style={{ marginLeft: 8 }}>
                <Text style={{ color: Colors.textColor, fontSize: 15, letterSpacing: 0.5, lineHeight: 24 }}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderSortData: ListRenderItem<FilterData> = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSortId(item.id)}
            style={{ flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.greyBorder, paddingHorizontal: 20 }}
        >
            <MaterialCommunityIcons
                name={sortId === item.id ? 'checkbox-intermediate' : 'checkbox-blank-outline'}
                size={24}
                color={Colors.orangeColor}
            />
            <View style={{ marginLeft: 8 }}>
                <Text style={{ color: Colors.textColor, fontSize: 15, letterSpacing: 0.5, lineHeight: 24 }}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const handleApplyFilter = () => {
        switch (priceItemId) {
            case 1:
                onApplyFilter('0', '200');
                break;
            case 2:
                onApplyFilter('200', '500');
                break;
            case 3:
                onApplyFilter('500', '1000');
                break;
            case 4:
                onApplyFilter('1000', '');
                break;
            default:
                break;
        }
        closeModal();
    };

    const handleApplySort = () => {
        switch (sortId) {
            case 1:
                onApplySort('rating', 'desc');
                break;
            case 2:
                onApplySort('unit_price', 'desc');
                break;
            case 3:
                onApplySort('unit_price', 'asc');
                break;
            case 4:
                onApplySort('num_of_sale', 'desc');
                break;
            default:
                break;
        }
        closeModal();
    };

    const handleResetFilter = () => {
        setPriceItemId(undefined);
        onClearFilter();
        closeModal();
    };

    const handleResetSort = () => {
        setSortId(undefined);
        onResetSort();
        closeModal();
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 12 }}>
                    {filterId === 1 ? (
                        <Feather name='filter' size={20} color={Colors.greyBorder} />
                    ) : (
                        <Octicons name='sort-desc' size={20} color={Colors.greyBorder} />
                    )}
                    <Text style={{
                        color: Colors.greyBorder,
                        fontFamily: 'serif',
                        fontWeight: '600',
                        marginLeft: 8,
                        fontSize: 20,
                        letterSpacing: 0.5
                    }}>
                        {filterId === 1 ? 'Filter' : 'Sort By'}
                    </Text>
                </View>

                <TouchableOpacity onPress={closeModal}>
                    <MaterialIcons name='cancel' size={35} color={Colors.orangeColor} />
                </TouchableOpacity>
            </View>

            {filterId === 1 ? (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: '40%', paddingHorizontal: 16, backgroundColor: Colors.bgGrayColor, borderRightWidth: 1, borderRightColor: Colors.greyColor50 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filterData}
                            renderItem={renderFilterData}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                    <View style={{ width: '60%', backgroundColor: Colors.white, paddingHorizontal: 16 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={priceData}
                            renderItem={renderPriceData}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1, paddingHorizontal: 16 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={sortByData}
                        renderItem={renderSortData}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}

            <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: Colors.greyBorder, height: 60 }}>
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={filterId === 1 ? handleResetFilter : handleResetSort}
                >
                    <Text style={{ color: Colors.textColor, fontFamily: 'serif', fontSize: 14 }}>Reset</Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: Colors.greyBorder }} />
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={filterId === 1 ? handleApplyFilter : handleApplySort}
                >
                    <Text style={{ color: Colors.textColor, fontFamily: 'serif', fontSize: 14 }}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Filter;
